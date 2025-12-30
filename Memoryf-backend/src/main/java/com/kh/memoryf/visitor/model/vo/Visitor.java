package com.kh.memoryf.visitor.model.vo;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Alias("visitor")
@NoArgsConstructor
@Setter
@Getter
@ToString
public class Visitor {
	
    private Date visitDate;
    private int memberNo;
    private int homeNo;
    
    public Visitor(int memberNo, int homeNo) {
        this.memberNo = memberNo;
        this.homeNo = homeNo;
    
    }

}


