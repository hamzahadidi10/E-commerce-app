package com.ecomsite.ecommerce.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.ecomsite.ecommerce.domain.Product;
import com.ecomsite.ecommerce.repo.ProductRepo;
import com.ecomsite.ecommerce.repo.UserRepo;

@Service
public class ProductService {

    
    private final ProductRepo productRepo;
    public ProductService(com.ecomsite.ecommerce.repo.ProductRepo productRepo, UserRepo userRepo) {
        this.productRepo = productRepo;
       
    }
    ///////////////////////////////////////////////////////////////
    public Product addProduct(Product product){
        product.setId(UUID.randomUUID().toString());
        return productRepo.save(product);

    }
    //////////////////////////////////////////////////////////////
    public List<Product> findAllProducts(){
        return productRepo.findAll();
    }
    //////////////////////////////////////////////////////////////
    public void deleteProduct(String id) {
        if (!productRepo.existsById(id)) {
            throw new IllegalArgumentException("Product with ID " + id + " not found.");
        }
        productRepo.deleteById(id);
    }

    ///////////////////////////////////////////////////////////////
    public Product updateProduct(String id, Product updatedData) {
    System.out.println("Updating product with ID: " + id);

    Product existingProduct = productRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

    if (updatedData.getProductName() != null) {
        existingProduct.setProductName(updatedData.getProductName());
    }
    if (updatedData.getPrice() != 0) {
        existingProduct.setPrice(updatedData.getPrice());
    }
    if (updatedData.getDescription() != null) {
        existingProduct.setDescription(updatedData.getDescription());
    }
    if (updatedData.getProductImageUrl() != null) {
        existingProduct.setProductImageUrl(updatedData.getProductImageUrl());
    }
    if (updatedData.getCategory() != null) {
        existingProduct.setCategory(updatedData.getCategory());
    }
    if (updatedData.getStatus() != null) {
        existingProduct.setStatus(updatedData.getStatus());
    }
    if (updatedData.getStock() != 0) {
        existingProduct.setStock(updatedData.getStock());
    }

    return productRepo.save(existingProduct);
}

    public Product findProductById(String id) {
    return productRepo.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + id));
}



}
