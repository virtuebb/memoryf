package com.kh.memoryf.dm.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.dm.model.dao.DmRoomRequest;
import com.kh.memoryf.dm.model.service.DmService;
import com.kh.memoryf.dm.model.vo.Dm;
import com.kh.memoryf.dm.model.vo.DmMessage;
import com.kh.memoryf.dm.model.vo.DmRoom;

// 이 클래스는 채팅 메시지를 처리하는 컨트롤러야.
// 메시지가 오면, 어디로 보낼지 결정해.
// ❌ @CrossOrigin 제거 (CorsConfig.java에서 전역으로 설정됨)
@RequestMapping("messages") 
@RestController
public class DmController {

    @Autowired
    private DmService dmService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    /*
    어노테이션을 사용하거나 직접 생성자 주입을 하거나
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }
    */

    
    // ===============================
    // 2️⃣ 1:1 채팅
    // ===============================
    // 이 메서드는 특정 사람에게만 메시지를 보내.
    @MessageMapping("/chat/private")
    public void privateChat(Dm message) {

        // 🔥 사용자 전용 채널로 직접 전송
        // System.out.println("📨 메시지 수신: " + message);
        // 우선적으로 recipientId 필드를 사용하고, 없으면 기존 roomId(레거시) 사용
        String recipient = message.getRecipientId() != null ? message.getRecipientId() : message.getRoomId();

        System.out.println("➡️ 대상(recipient): " + recipient + " , roomNo: " + message.getRoomNo());

        // -- 서버에서 메시지 저장하도록 함 (클라이언트가 별도 REST 호출하지 않아도 DB에 저장)
        try {
            if (message.getRoomNo() != null && message.getSender() != null && message.getContent() != null) {
                Map<String, Object> map = new HashMap<>();
                map.put("roomNo", message.getRoomNo());
                map.put("senderId", message.getSender());
                map.put("content", message.getContent());
                dmService.insertMessage(map);
            }
        } catch (Exception e) {
            System.err.println("⚠️ 메시지 DB 저장 실패: " + e.getMessage());
        }

        // 1) 기존 구독 경로로 발송
        messagingTemplate.convertAndSend("/sub/private/" + recipient, message);
        // 2) Spring의 user destination으로도 발송(구독 방식에 따라 수신 보장)
        try {
            messagingTemplate.convertAndSendToUser(recipient, "/queue/private", message);
        } catch (Exception e) {
            System.err.println("⚠️ convertAndSendToUser 실패: " + e.getMessage());
        }
    }

    // DM 방 목록 조회 (userId로 채팅방 목록 조회)
    @GetMapping("/rooms/{userId}")
    public ArrayList<DmRoom> selectDmRoomList(@PathVariable String userId) {

        // System.out.println("📡 채팅방 조회 요청 - userId: " + userId);

        ArrayList<DmRoom> list = dmService.selectDmRoomList(userId);

        // System.out.println("✅ 조회된 채팅방 목록: " + list);

        return list;
    }

    // DM 방 추가
    // @RequestBody는 JSON을 자바 객체로 매핑해주는 것이지, JSON 내부 필드를 자동 추출해주는 게 아님
    // 그래서 외부 클래스를 하나 만들어서 jackson 라이브러리가 자동으로 json을 파싱하고 DmRoomRequset 객체를 생성하고 JSON의 targetuserId 키의 값우루 객체의 targetUserId 필드에 매핑
    @PostMapping("insertRoom")
    public Map<String, Object> insertRoom(@RequestBody DmRoomRequest request) {

        String targetUserId = request.getTargetUserId();
        String userId = request.getUserId();

        // System.out.println(targetUserId);
        // System.out.println(userId);

        int roomNo = dmService.insertRoom(targetUserId, userId);

        int sender  = dmService.insertParticipantSender(roomNo, targetUserId, userId);
        int reciever = dmService.insertParticipantReciever(roomNo, targetUserId, userId);

        // System.out.println(sender);
        // System.out.println(reciever);

        Map<String, Object> resp = new HashMap<>();
        if (roomNo > 0) {
            resp.put("roomNo", roomNo);
            resp.put("roomName", targetUserId);
            resp.put("targetUserId", targetUserId);
            resp.put("message", "채팅방 추가 성공");
        } else {
            resp.put("roomNo", 0);
            resp.put("message", "채팅방 추가 실패");
        }

        return resp;

    }

    // DM 메세지 조회
    // 같은 방을 기준으로 내가 보낸거랑 상대가 보낸거를 전부 조회해야됨
    @PostMapping("{roomNo}/select")
    public ArrayList<DmMessage> selectMessage(@RequestBody DmRoomRequest request) {
        
        int roomNo = request.getRoomNo();
        String senderId = request.getSenderId();

        Map<String, Object> map = new HashMap<String,Object>();

        map.put("roomNo", roomNo);
        map.put("senderId", senderId);

        ArrayList<DmMessage> list = dmService.selectMessage(map);

        // System.out.println("📥 조회된 메시지 목록: " + list);

        return list;

    }
    
    // DM 메세지 저장
    @PostMapping("{roomNo}/insert")
    public int insertMessage(@RequestBody DmRoomRequest request) {

        int roomNo = request.getRoomNo();
        String senderId = request.getSenderId();
        String content = request.getContent();

        Map<String, Object> map = new HashMap<String,Object>();

        map.put("roomNo", roomNo);
        map.put("senderId", senderId);
        map.put("content", content);



        System.out.println("roomNo : " + roomNo);
        System.out.println("senderId : " + senderId);
        System.out.println("content : " + content);

        return dmService.insertMessage(map);


    }
    




    // dm 방 상세 조회

    // 읽음 처리

    // 새 메세지 저장




}
