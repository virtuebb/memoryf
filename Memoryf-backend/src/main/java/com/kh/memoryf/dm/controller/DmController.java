package com.kh.memoryf.dm.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.common.response.ApiResponse;
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
                System.out.println("✅ 메시지 DB 저장 완료: " + message.getContent());
            }
        } catch (Exception e) {
            System.err.println("⚠️ 메시지 DB 저장 실패: " + e.getMessage());
        }

        // 1) 기존 구독 경로로 발송
        messagingTemplate.convertAndSend("/sub/private/" + recipient, message);
        System.out.println("📤 /sub/private/" + recipient + "로 메시지 전송");
        
        // 2) Spring의 user destination으로도 발송(구독 방식에 따라 수신 보장)
        try {
            messagingTemplate.convertAndSendToUser(recipient, "/queue/private", message);
            System.out.println("📤 /user/queue/private로 메시지 전송 (user: " + recipient + ")");
        } catch (Exception e) {
            System.err.println("⚠️ convertAndSendToUser 실패: " + e.getMessage());
        }
    }

    /**
     * DM 방 목록 조회
     */
    @GetMapping("/rooms/{userId}")
    public ApiResponse<List<DmRoom>> selectDmRoomList(@PathVariable String userId) {
        ArrayList<DmRoom> list = dmService.selectDmRoomList(userId);
        return ApiResponse.success(list);
    }

    /**
     * DM 방 추가
     */
    @PostMapping("insertRoom")
    public ApiResponse<HashMap<String, Object>> insertRoom(@RequestBody DmRoomRequest request) {
        int roomNo = dmService.createDmRoom(request);

        if (roomNo > 0) {
            HashMap<String, Object> data = new HashMap<>();
            data.put("roomNo", roomNo);
            data.put("roomName", request.getTargetUserId());
            data.put("targetUserId", request.getTargetUserId());
            return ApiResponse.success("채팅방이 생성되었습니다.", data);
        } else {
            return ApiResponse.error("채팅방 추가에 실패했습니다.");
        }
    }

    /**
     * DM 메시지 조회
     */
    @PostMapping("{roomNo}/select")
    public ApiResponse<List<DmMessage>> selectMessage(@RequestBody DmRoomRequest request) {
        int roomNo = request.getRoomNo();
        String senderId = request.getSenderId();

        Map<String, Object> map = new HashMap<>();
        map.put("roomNo", roomNo);
        map.put("senderId", senderId);

        ArrayList<DmMessage> list = dmService.selectMessage(map);
        return ApiResponse.success(list);
    }
    
    /**
     * DM 메시지 저장
     */
    @PostMapping("{roomNo}/insert")
    public ApiResponse<Void> insertMessage(@RequestBody DmRoomRequest request) {
        int roomNo = request.getRoomNo();
        String senderId = request.getSenderId();
        String content = request.getContent();

        Map<String, Object> map = new HashMap<>();
        map.put("roomNo", roomNo);
        map.put("senderId", senderId);
        map.put("content", content);

        int result = dmService.insertMessage(map);
        
        if (result > 0) {
            return ApiResponse.success("메시지가 저장되었습니다.", null);
        } else {
            return ApiResponse.error("메시지 저장에 실패했습니다.");
        }
    }
    
    /**
     * DM 읽음 처리
     */
    @PostMapping("{roomNo}/markAsRead")
    public ApiResponse<HashMap<String, Object>> markAsRead(@PathVariable int roomNo, @RequestBody DmRoomRequest request) {
        String readerId = request.getSenderId();
        
        Map<String, Object> requestMap = new HashMap<>();
        requestMap.put("roomNo", roomNo);
        requestMap.put("readerId", readerId);
        
        int result = dmService.updateReadStatus(requestMap);
        
        HashMap<String, Object> data = new HashMap<>();
        data.put("roomNo", roomNo);
        data.put("readerId", readerId);
        
        if (result > 0) {
            return ApiResponse.success("읽음 처리 성공", data);
        } else {
            return ApiResponse.error("읽음 처리 실패");
        }
    }
    
    /**
     * 미읽은 메시지 개수 조회
     */
    @GetMapping("{roomNo}/unreadCount/{readerId}")
    public ApiResponse<HashMap<String, Object>> getUnreadCount(@PathVariable int roomNo, @PathVariable String readerId) {
        Map<String, Object> requestMap = new HashMap<>();
        requestMap.put("roomNo", roomNo);
        requestMap.put("readerId", readerId);
        
        int unreadCount = dmService.getUnreadMessageCount(requestMap);
        
        HashMap<String, Object> data = new HashMap<>();
        data.put("roomNo", roomNo);
        data.put("readerId", readerId);
        data.put("unreadCount", unreadCount);
        
        return ApiResponse.success(data);
    }

    /**
     * 메시지 삭제
     */
    @PostMapping("delete/{messageId}")
    public ApiResponse<Void> deleteMessage(@PathVariable int messageId) {
        int result = dmService.deleteMessage(messageId);

        if (result > 0) {
            Integer roomNo = dmService.getRoomNoByMessageId(messageId);
            if (roomNo != null) {
                ArrayList<String> participants = dmService.getParticipantsByRoomNo(roomNo);
                for (String participantId : participants) {
                    messagingTemplate.convertAndSend("/sub/private/" + participantId, 
                        Map.of("type", "delete", "roomNo", roomNo, "messageId", messageId));
                }
            }
            return ApiResponse.success("메시지가 삭제되었습니다.", null);
        } else {
            return ApiResponse.error("메시지 삭제에 실패했습니다.");
        }
    }

    /**
     * 채팅방 삭제
     */
    @PostMapping("deleteDmRoom/{roomNo}")
    public ApiResponse<Void> deleteDmRoom(@PathVariable int roomNo) {
        int result = dmService.deleteDmRoom(roomNo);
        
        if (result > 0) {
            return ApiResponse.success("채팅방이 삭제되었습니다.", null);
        } else {
            return ApiResponse.error("채팅방 삭제에 실패했습니다.");
        }
    }
}
