package com.kh.memoryf.dm.model.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.kh.memoryf.dm.model.vo.DmMessage;
import com.kh.memoryf.dm.model.vo.DmRoom;

/**
 * DM Service Interface
 * V3 스키마 기준: MEMBER_NO 사용
 */
public interface DmService {

    // ===========================
    // 채팅방 관련
    // ===========================

    /**
     * 채팅방 목록 조회 (회원번호 기준)
     */
    ArrayList<DmRoom> selectDmRoomList(int memberNo);

    /**
     * 채팅방 목록 조회 (회원 아이디 기준 - 레거시 호환)
     */
    ArrayList<DmRoom> selectDmRoomListByMemberId(String memberId);

    /**
     * DM 방 생성 또는 기존 방 반환
     * @param memberNo 현재 사용자 회원번호
     * @param targetMemberNo 상대방 회원번호
     * @return 채팅방 번호
     */
    int createOrGetDmRoom(int memberNo, int targetMemberNo);

    /**
     * 채팅방 나가기
     */
    int leaveRoom(int roomNo, int memberNo);

    /**
     * 채팅방 삭제
     */
    int deleteDmRoom(int roomNo);

    /**
     * 채팅방 참여자 목록 조회 (회원번호 반환)
     */
    List<Integer> getParticipantsByRoomNo(int roomNo);

    /**
     * 채팅방 참여자 목록 조회 (회원 아이디 반환 - 레거시)
     */
    List<String> getParticipantIdsByRoomNo(int roomNo);

    // ===========================
    // 메시지 관련
    // ===========================

    /**
     * 메시지 저장
     */
    int insertMessage(int roomNo, int senderNo, String content, String messageType);

    /**
     * 메시지 목록 조회
     */
    ArrayList<DmMessage> selectMessage(int roomNo, int senderNo);

    /**
     * 메시지 삭제
     */
    int deleteMessage(int messageNo);

    /**
     * 메시지 ID로 ROOM_NO 조회
     */
    Integer getRoomNoByMessageId(int messageNo);

    // ===========================
    // 읽음 처리 관련
    // ===========================

    /**
     * 읽음 처리
     */
    int updateReadStatus(int roomNo, int memberNo);

    /**
     * 미읽은 메시지 개수 조회
     */
    int getUnreadMessageCount(int roomNo, int memberNo);

    /**
     * 알림 음소거 설정
     */
    int updateMuteStatus(int roomNo, int memberNo, String isMuted);

    // ===========================
    // 레거시 호환 메서드 (Deprecated)
    // ===========================

    @Deprecated
    int insertMessage(Map<String, Object> map);

    @Deprecated
    ArrayList<DmMessage> selectMessage(Map<String, Object> map);

    @Deprecated
    int updateReadStatus(Map<String, Object> map);

    @Deprecated
    int getUnreadMessageCount(Map<String, Object> map);
}
