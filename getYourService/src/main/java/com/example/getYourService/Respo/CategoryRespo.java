package com.example.getYourService.Respo;




import com.example.getYourService.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRespo extends JpaRepository<Category, Integer> {

}

