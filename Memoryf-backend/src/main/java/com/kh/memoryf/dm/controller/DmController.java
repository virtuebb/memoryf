package com.kh.memoryf.dm.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.common.response.ApiResponse;
import com.kh.memoryf.dm.model.dao.DmRoomRequest;
import com.kh.memoryf.dm.model.service.DmService;
import com.kh.memoryf.dm.model.vo.Dm;
import com.kh.memoryf.dm.model.vo.DmMessage;
import com.kh.memoryf.dm.model.vo.DmRoom;

/**
 * DM Controller
 * V3 스키마 기준: MEMBER_NO 사용 (레거시 호환성 유지)
 */
@RequestMapping("messages")
@RestController
public class DmController {

    @Autowired
    private DmService dmService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // ===============================
    // WebSocket 메시지 핸들러
    // ===============================

    /**
     * 1:1 채팅 메시지 처리 (WebSocket)
     */
    @MessageMapping("/chat/private")
    public void privateChat(Dm message) {
        System.out.println("📨 메시지 수신: " + message);

        String recipient = message.getRecipientId() != null ? message.getRecipientId() : message.getRoomId();
        System.out.println("➡️ 대상(recipient): " + recipient + " , roomNo: " + message.getRoomNo());

        // DB에 메시지 저장
        try {
            if (message.getRoomNo() != null && message.getSenderNo() != null && message.getContent() != null) {
                dmService.insertMessage(
                    message.getRoomNo(),
                    message.getSenderNo(),
                    message.getContent(),
                    message.getMessageType()
                );
                System.out.println("✅ 메시지 DB 저장 완료: " + message.getContent());
            } else if (message.getRoomNo() != null && message.getSender() != null && message.getContent() != null) {
                // 레거시: senderNo 대신 sender(문자열) 사용
                Map<String, Object> map = new HashMap<>();
                map.put("roomNo", message.getRoomNo());
                map.put("senderId", message.getSender());
                map.put("content", message.getContent());
                dmService.insertMessage(map);
                System.out.println("✅ 메시지 DB 저장 완료 (레거시): " + message.getContent());
            }
        } catch (Exception e) {
            System.err.println("⚠️ 메시지 DB 저장 실패: " + e.getMessage());
        }

        // 구독자들에게 메시지 전송
        messagingTemplate.convertAndSend("/sub/private/" + recipient, message);
        System.out.println("📤 /sub/private/" + recipient + "로 메시지 전송");

        try {
            messagingTemplate.convertAndSendToUser(recipient, "/queue/private", message);
            System.out.println("📤 /user/queue/private로 메시지 전송 (user: " + recipient + ")");
        } catch (Exception e) {
            System.err.println("⚠️ convertAndSendToUser 실패: " + e.getMessage());
        }
    }

    // ===============================
    // V3 API (MEMBER_NO 기준)
    // ===============================

    /**
     * 채팅방 목록 조회 (회원번호 기준)
     */
    @GetMapping("/rooms/member/{memberNo}")
    public ApiResponse<List<DmRoom>> selectDmRoomListByMemberNo(@PathVariable int memberNo) {
        ArrayList<DmRoom> list = dmService.selectDmRoomList(memberNo);
        return ApiResponse.success(list);
    }

    /**
     * 채팅방 생성 또는 기존 방 반환
     */
    @PostMapping("/rooms")
    public ApiResponse<Map<String, Object>> createOrGetRoom(@RequestBody DmRoomRequest request) {
        int memberNo = request.getMemberNo();
        int targetMemberNo = request.getTargetMemberNo();

        int roomNo = dmService.createOrGetDmRoom(memberNo, targetMemberNo);

        if (roomNo > 0) {
            Map<String, Object> data = new HashMap<>();
            data.put("roomNo", roomNo);
            data.put("targetMemberNo", targetMemberNo);
            return ApiResponse.success("채팅방이 준비되었습니다.", data);
        } else {
            return ApiResponse.error("채팅방 생성에 실패했습니다.");
        }
    }

    /**
     * 메시지 목록 조회
     */
    @GetMapping("/{roomNo}/messages/{senderNo}")
    public ApiResponse<List<DmMessage>> selectMessages(
            @PathVariable int roomNo,
            @PathVariable int senderNo) {
        ArrayList<DmMessage> list = dmService.selectMessage(roomNo, senderNo);
        return ApiResponse.success(list);
    }

    /**
     * 메시지 저장
     */
    @PostMapping("/{roomNo}/messages")
    public ApiResponse<Void> insertMessage(
            @PathVariable int roomNo,
            @RequestBody DmRoomRequest request) {
        int result = dmService.insertMessage(
            roomNo,
            request.getSenderNo(),
            request.getContent(),
            request.getMessageType()
        );

        if (result > 0) {
            return ApiResponse.success("메시지가 저장되었습니다.", null);
        } else {
            return ApiResponse.error("메시지 저장에 실패했습니다.");
        }
    }

    /**
     * 읽음 처리
     */
    @PutMapping("/{roomNo}/read/{memberNo}")
    public ApiResponse<Map<String, Object>> markAsRead(
            @PathVariable int roomNo,
            @PathVariable int memberNo) {
        int result = dmService.updateReadStatus(roomNo, memberNo);

        Map<String, Object> data = new HashMap<>();
        data.put("roomNo", roomNo);
        data.put("memberNo", memberNo);

        if (result > 0) {
            return ApiResponse.success("읽음 처리 성공", data);
        } else {
            return ApiResponse.error("읽음 처리 실패");
        }
    }

    /**
     * 미읽은 메시지 개수 조회
     */
    @GetMapping("/{roomNo}/unread/{memberNo}")
    public ApiResponse<Map<String, Object>> getUnreadCount(
            @PathVariable int roomNo,
            @PathVariable int memberNo) {
        int unreadCount = dmService.getUnreadMessageCount(roomNo, memberNo);

        Map<String, Object> data = new HashMap<>();
        data.put("roomNo", roomNo);
        data.put("memberNo", memberNo);
        data.put("unreadCount", unreadCount);

        return ApiResponse.success(data);
    }

    /**
     * 메시지 삭제
     */
    @DeleteMapping("/messages/{messageNo}")
    public ApiResponse<Void> deleteMessage(@PathVariable int messageNo) {
        int result = dmService.deleteMessage(messageNo);

        if (result > 0) {
            Integer roomNo = dmService.getRoomNoByMessageId(messageNo);
            if (roomNo != null) {
                List<String> participants = dmService.getParticipantIdsByRoomNo(roomNo);
                for (String participantId : participants) {
                    messagingTemplate.convertAndSend("/sub/private/" + participantId,
                        Map.of("type", "delete", "roomNo", roomNo, "messageNo", messageNo));
                }
            }
            return ApiResponse.success("메시지가 삭제되었습니다.", null);
        } else {
            return ApiResponse.error("메시지 삭제에 실패했습니다.");
        }
    }

    /**
     * 채팅방 나가기
     */
    @PutMapping("/rooms/{roomNo}/leave/{memberNo}")
    public ApiResponse<Void> leaveRoom(
            @PathVariable int roomNo,
            @PathVariable int memberNo) {
        int result = dmService.leaveRoom(roomNo, memberNo);

        if (result > 0) {
            return ApiResponse.success("채팅방에서 나갔습니다.", null);
        } else {
            return ApiResponse.error("채팅방 나가기에 실패했습니다.");
        }
    }

    /**
     * 채팅방 삭제
     */
    @DeleteMapping("/rooms/{roomNo}")
    public ApiResponse<Void> deleteDmRoom(@PathVariable int roomNo) {
        int result = dmService.deleteDmRoom(roomNo);

        if (result > 0) {
            return ApiResponse.success("채팅방이 삭제되었습니다.", null);
        } else {
            return ApiResponse.error("채팅방 삭제에 실패했습니다.");
        }
    }

    // ===============================
    // 레거시 API (MEMBER_ID 기준) - 하위 호환성
    // ===============================

    /**
     * 채팅방 목록 조회 (회원 아이디 기준 - 레거시)
     */
    @GetMapping("/rooms/{userId}")
    public ApiResponse<List<DmRoom>> selectDmRoomList(@PathVariable String userId) {
        ArrayList<DmRoom> list = dmService.selectDmRoomListByMemberId(userId);
        return ApiResponse.success(list);
    }

    /**
     * 채팅방 생성 (레거시)
     */
    @PostMapping("insertRoom")
    public ApiResponse<Map<String, Object>> insertRoom(@RequestBody DmRoomRequest request) {
        // 레거시 방식은 더 이상 지원하지 않음 - V3 API 사용 권장
        return ApiResponse.error("이 API는 더 이상 지원되지 않습니다. POST /messages/rooms를 사용하세요.");
    }

    /**
     * 메시지 조회 (레거시)
     */
    @PostMapping("{roomNo}/select")
    public ApiResponse<List<DmMessage>> selectMessage(@RequestBody DmRoomRequest request) {
        int roomNo = request.getRoomNo();
        Map<String, Object> map = new HashMap<>();
        map.put("roomNo", roomNo);
        map.put("senderNo", request.getSenderNo());

        ArrayList<DmMessage> list = dmService.selectMessage(map);
        return ApiResponse.success(list);
    }

    /**
     * 메시지 저장 (레거시)
     */
    @PostMapping("{roomNo}/insert")
    public ApiResponse<Void> insertMessageLegacy(@RequestBody DmRoomRequest request) {
        Map<String, Object> map = new HashMap<>();
        map.put("roomNo", request.getRoomNo());
        map.put("senderNo", request.getSenderNo());
        map.put("content", request.getContent());
        map.put("messageType", "TEXT");

        int result = dmService.insertMessage(map);

        if (result > 0) {
            return ApiResponse.success("메시지가 저장되었습니다.", null);
        } else {
            return ApiResponse.error("메시지 저장에 실패했습니다.");
        }
    }

    /**
     * 읽음 처리 (레거시)
     */
    @PostMapping("{roomNo}/markAsRead")
    public ApiResponse<Map<String, Object>> markAsReadLegacy(
            @PathVariable int roomNo,
            @RequestBody DmRoomRequest request) {
        Map<String, Object> requestMap = new HashMap<>();
        requestMap.put("roomNo", roomNo);
        requestMap.put("memberNo", request.getSenderNo());

        int result = dmService.updateReadStatus(requestMap);

        Map<String, Object> data = new HashMap<>();
        data.put("roomNo", roomNo);
        data.put("memberNo", request.getSenderNo());

        if (result > 0) {
            return ApiResponse.success("읽음 처리 성공", data);
        } else {
            return ApiResponse.error("읽음 처리 실패");
        }
    }

    /**
     * 미읽은 메시지 개수 조회 (레거시)
     */
    @GetMapping("{roomNo}/unreadCount/{readerId}")
    public ApiResponse<Map<String, Object>> getUnreadCountLegacy(
            @PathVariable int roomNo,
            @PathVariable String readerId) {
        // 레거시는 memberNo를 직접 파싱할 수 없으므로 0 반환
        Map<String, Object> data = new HashMap<>();
        data.put("roomNo", roomNo);
        data.put("readerId", readerId);
        data.put("unreadCount", 0);

        return ApiResponse.success(data);
    }

    /**
     * 메시지 삭제 (레거시)
     */
    @PostMapping("delete/{messageId}")
    public ApiResponse<Void> deleteMessageLegacy(@PathVariable int messageId) {
        int result = dmService.deleteMessage(messageId);

        if (result > 0) {
            Integer roomNo = dmService.getRoomNoByMessageId(messageId);
            if (roomNo != null) {
                List<String> participants = dmService.getParticipantIdsByRoomNo(roomNo);
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
     * 채팅방 삭제 (레거시)
     */
    @PostMapping("deleteDmRoom/{roomNo}")
    public ApiResponse<Void> deleteDmRoomLegacy(@PathVariable int roomNo) {
        int result = dmService.deleteDmRoom(roomNo);

        if (result > 0) {
            return ApiResponse.success("채팅방이 삭제되었습니다.", null);
        } else {
            return ApiResponse.error("채팅방 삭제에 실패했습니다.");
        }
    }
}
