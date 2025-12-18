package com.kh.memoryf.member.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.member.model.service.MemberService;

@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("member")
public class MemberController {

	@Autowired
	@SuppressWarnings("unused")
	private MemberService memberService;

}
