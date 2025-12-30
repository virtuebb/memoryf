package com.kh.memoryf.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import java.util.Objects;

import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private AdminInterceptor adminInterceptor;

    @Override
    public void addInterceptors(@NonNull InterceptorRegistry registry) {
        // Apply to all admin paths
        Objects.requireNonNull(adminInterceptor, "adminInterceptor must not be null");
        registry.addInterceptor(adminInterceptor)
                .addPathPatterns("/admin/**");
    }
    
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // 업로드된 피드 이미지 제공 (file system)
        String feedUploadPath = System.getProperty("user.home") + "/memoryf/feed_upfiles/";
        registry.addResourceHandler("/feed_upfiles/**")
                .addResourceLocations("file:" + feedUploadPath)
                .setCachePeriod(3600);
        
        // 업로드된 프로필 이미지 제공 (file system)
        String profileUploadPath = System.getProperty("user.home") + "/memoryf/profile_images/";
        registry.addResourceHandler("/profile_images/**")
                .addResourceLocations("file:" + profileUploadPath)
                .setCachePeriod(3600);
        
     // 업로드된 스토리 이미지 제공 (file system)
        String storyUploadPath = System.getProperty("user.home") + "/memoryf/feed_upfiles/";
        registry.addResourceHandler("/resources/story/**")
                .addResourceLocations("file:" + storyUploadPath)
                .setCachePeriod(3600);

    }
}
