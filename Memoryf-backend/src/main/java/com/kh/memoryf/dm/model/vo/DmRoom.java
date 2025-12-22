package com.kh.memoryf.dm.model.vo;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("dmRoom")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class DmRoom {
    private int roomNo;         //     ROOM_NO	NUMBER
    private String roomName;
    private Date createDate;    // CREATE_DATE	DATE
}
