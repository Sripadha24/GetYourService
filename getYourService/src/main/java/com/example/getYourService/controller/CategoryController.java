package com.example.getYourService.controller;

import com.example.getYourService.model.Category;
import com.example.getYourService.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
public class CategoryController {

    @Autowired
    private CategoryService categoryService;
    @GetMapping("/getallcategory")
   public ResponseEntity<List<Category>> getallcategory(){
       return ResponseEntity.ok(categoryService.getallcategory());
   }
   @GetMapping("/getcategoty")
   public ResponseEntity<Optional<Category>> getCategory(@RequestParam Integer id){
        return  ResponseEntity.ok(categoryService.getCategory(id));
   }

}
