package com.kh.memoryf.bgm.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class MelonChartDto {
    private String title;
    private String artist;
    private int rank;
    private String thumbnail;
    public MelonChartDto(String title, String artist, int rank) {
        this.title = title;
        this.artist = artist;
        this.rank = rank;
    }
}
