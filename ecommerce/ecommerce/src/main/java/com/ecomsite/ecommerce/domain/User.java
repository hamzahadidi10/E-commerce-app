package com.ecomsite.ecommerce.domain;

import java.io.Serializable;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
@Entity
public class User implements Serializable{
    @Id
    @Column(nullable=false , updatable= false , unique = true )
    private String cin;
    @Column(nullable=false , updatable= true )
    private String username; 
    @Column(nullable = false)
    private String role = "user";
    @Email
    @Column(nullable=false , updatable= true )
    private String email;
    @Column(nullable=false , updatable= true )
    private String phone;
    @Column(name = "date", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime date;
    @Column(nullable=false , updatable= true )
    private String city;

    private String code;
    @NotBlank
    private String password;
    @Column(name = "image_url")
    private String imageUrl = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"; // Default value


     // Default constructor (required by JPA)
    public User() {
    }
    
    // All-args constructor (convenience)
    public User(String cin, String username, String role ,  String email, String phone, LocalDateTime date ,String city, String code,String password, String imageUrl) {
        this.cin = cin;
        this.username = username;
        this.email = email;
        this.phone=phone;
        this.date=date;
        this.city = city;
        this.password = password;
        this.code = code;
        this.imageUrl = imageUrl;
        this.role = role ;
    }


     // Getters

     public String getRole() {
        return role;
    }
    public String getCin() {
        return cin;
    }
    
    public String getUsername() {
        return username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public String getPhone() {
        return phone;
    }
    public LocalDateTime getDate(){
        return date;
    }
    public String getCity() {
        return city;
    }
    public String getPassword() {
        return password;
    }
    public String getImageUrl() {
        return imageUrl;
    }
    public String getCode() {
        return code;
    }

    


    // Setters

    public void setRole(String role) {
        this.role = role;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public void setDate(LocalDateTime date) {
        this.date = date;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public void setCode(String code) {
        this.code = code;
    }
    public void setCity(String city) {
        this.city = city;
    }
     public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }



}


