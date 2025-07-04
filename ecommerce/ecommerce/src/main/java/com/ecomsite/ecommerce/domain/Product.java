package com.ecomsite.ecommerce.domain;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;


@Entity
public class Product implements Serializable {
     @Id
    @Column(nullable = false, updatable = false)
    private String id;

    @Column(nullable = false)
    private String productName;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String productImageUrl;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String status;


    public Product() {
    }

    public Product(String id, String productName, String description, String productImageUrl,Double price, Integer stock, String category, String status) {
        this.id = id;
        this.productName = productName;
        this.description = description;
        this.productImageUrl = productImageUrl;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.status = status;
    }


    public String getId() {
        return id;
    }

    public String getProductName() {
        return productName;
    }

    public String getDescription() {
        return description;
    }
    public String getProductImageUrl() {
        return productImageUrl;
    }

    public Double getPrice() {
        return price;
    }

    public Integer getStock() {
        return stock;
    }

    public String getCategory() {
        return category;
    }

    public String getStatus() {
        return status;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setProductImageUrl(String productImageUrl) {
        this.productImageUrl = productImageUrl;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}


