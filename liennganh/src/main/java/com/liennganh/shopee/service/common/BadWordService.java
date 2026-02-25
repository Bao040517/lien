package com.liennganh.shopee.service.common;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class BadWordService {

    private final Set<String> badWords = new HashSet<>();

    @PostConstruct
    public void init() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            InputStream viStream = new ClassPathResource("badwords-vi.json").getInputStream();
            List<String> viList = mapper.readValue(viStream, new TypeReference<>() {});
            for (String w : viList) badWords.add(w.toLowerCase().trim());

            InputStream engStream = new ClassPathResource("badwords-eng.json").getInputStream();
            List<String> engList = mapper.readValue(engStream, new TypeReference<>() {});
            for (String w : engList) badWords.add(w.toLowerCase().trim());
        } catch (Exception e) {
            throw new RuntimeException("Failed to load bad word lists", e);
        }
    }

    public boolean containsBadWord(String text) {
        if (text == null || text.isBlank()) return false;
        String lowerText = text.toLowerCase();

        for (String word : badWords) {
            int idx = lowerText.indexOf(word);
            while (idx != -1) {
                boolean boundaryBefore = idx == 0 || !Character.isLetterOrDigit(lowerText.charAt(idx - 1));
                int end = idx + word.length();
                boolean boundaryAfter = end >= lowerText.length() || !Character.isLetterOrDigit(lowerText.charAt(end));

                if (boundaryBefore && boundaryAfter) return true;

                idx = lowerText.indexOf(word, idx + 1);
            }
        }
        return false;
    }

    public List<String> findBadWords(String text) {
        List<String> found = new ArrayList<>();
        if (text == null || text.isBlank()) return found;
        String lowerText = text.toLowerCase();

        for (String word : badWords) {
            int idx = lowerText.indexOf(word);
            while (idx != -1) {
                boolean boundaryBefore = idx == 0 || !Character.isLetterOrDigit(lowerText.charAt(idx - 1));
                int end = idx + word.length();
                boolean boundaryAfter = end >= lowerText.length() || !Character.isLetterOrDigit(lowerText.charAt(end));

                if (boundaryBefore && boundaryAfter) {
                    found.add(text.substring(idx, end));
                    break;
                }
                idx = lowerText.indexOf(word, idx + 1);
            }
        }
        return found;
    }
}
