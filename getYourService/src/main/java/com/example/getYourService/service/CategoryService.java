package com.example.getYourService.service;

import com.example.getYourService.Respo.CategoryRespo;
import com.example.getYourService.model.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
    @Autowired
    CategoryRespo categoryRespo;

    public List<Category> getallcategory(){

        return categoryRespo.findAll();
    }
     public Category postCategory(Category category){
        return categoryRespo.save(category);
     }
     public String deleteCategory(Integer id){

         categoryRespo.deleteById(id);
         return " deleted";
     }
     public Optional<Category> getCategory(Integer id){
        return categoryRespo.findById(id);
     }
}
