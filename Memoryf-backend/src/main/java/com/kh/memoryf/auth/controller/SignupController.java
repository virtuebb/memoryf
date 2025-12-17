package com.kh.memoryf.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.memoryf.auth.model.service.SignupService;

@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("signup")
public class SignupController {
	
	@Autowired
	private SignupService signupService; 

}
