package com.kh.retrogram.member.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.retrogram.member.model.service.MemberService;

@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("member")
public class MemberController {

	@Autowired
	private MemberService memberService;

}
