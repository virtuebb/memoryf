package com.kh.memoryf.report.model.vo;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * 통합 신고 VO
 * 테이블: TB_REPORT (V3 스키마)
 * 
 * V3: TB_REPORT_FEED, TB_REPORT_COMMENT 통합 → TB_REPORT
 */
@Alias("report")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
@ToString
public class Report {
    
    // === DB 컬럼 (V3 스키마) ===
    private int reportNo;              // REPORT_NO (PK)
    private String reportType;          // REPORT_TYPE ('FEED', 'COMMENT', 'STORY', 'GUESTBOOK', 'DM', 'MEMBER')
    private int targetNo;              // TARGET_NO (FEED_NO, COMMENT_NO 등)
    private int reporterNo;             // REPORTER_NO (신고자 회원번호)
    private Integer reportedMemberNo;  // REPORTED_MEMBER_NO (피신고자 회원번호)
    private String reasonCode;         // REASON_CODE (신고 사유 코드)
    private String reasonDetail;       // REASON_DETAIL (신고 사유 상세)
    private String processStatus;      // PROCESS_STATUS ('PENDING', 'REVIEWING', 'ACCEPTED', 'REJECTED', 'COMPLETED')
    private Integer adminNo;           // ADMIN_NO (처리 관리자)
    private String adminMemo;          // ADMIN_MEMO (관리자 메모)
    private Date createdAt;            // CREATED_AT
    private Date processedAt;          // PROCESSED_AT
    
    // === 조인용 필드 ===
    private String reporterNick;       // 신고자 닉네임
    private String feedWriterNick;     // 피드 작성자 닉네임
    private String commentWriterNick;  // 댓글 작성자 닉네임
    private String feedContent;        // 피드 내용
    private String commentContent;     // 댓글 내용
}
