package com.kh.retrogram.home.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kh.retrogram.home.model.service.HomeService;

@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("home")
public class HomeContoller {


	@Autowired
	private HomeService homeService;
}
