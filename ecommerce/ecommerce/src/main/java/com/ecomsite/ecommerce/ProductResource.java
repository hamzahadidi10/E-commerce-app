package com.ecomsite.ecommerce;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecomsite.ecommerce.domain.Product;
import com.ecomsite.ecommerce.service.ProductService;



@RestController
@RequestMapping("/product")

public class ProductResource {
    private final ProductService productService;

    public ProductResource(ProductService productService){
        this.productService = productService;
    }

  @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProducts() {   
        try {
            List<Product> products = productService.findAllProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

  @GetMapping("/find/{id}")
public ResponseEntity<?> getProductById(@PathVariable("id") String id) {
    try {
        Product product = productService.findProductById(id);
        return new ResponseEntity<>(product, HttpStatus.OK);
    } catch (IllegalArgumentException e) {
        // ID not found
        return new ResponseEntity<>("Product not found with ID: " + id, HttpStatus.NOT_FOUND);
    } catch (Exception e) {
        // Generic error (e.g., DB issue)
        return new ResponseEntity<>("Error fetching product: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


    

    @PostMapping("/add")
    public ResponseEntity<Product> addProduct(@RequestBody Product product){
        Product newProduct = productService.addProduct(product);
        return new ResponseEntity<>(newProduct , HttpStatus.CREATED);
    }
     @PutMapping("/update/{id}")
public ResponseEntity<?> updateProduct(@PathVariable String id, @RequestBody Product product) {
    try {
        Product updatedProduct = productService.updateProduct(id, product);
        return ResponseEntity.ok(updatedProduct);
    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found with id: " + id);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Update failed: " + e.getMessage());
    }
}


   @DeleteMapping("/delete/{id}")
public ResponseEntity<?> deleteProduct(@PathVariable("id") String id) {
    try {
        productService.deleteProduct(id);
        return new ResponseEntity<>(HttpStatus.OK);
    } catch (IllegalArgumentException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    } catch (Exception e) {
        return new ResponseEntity<>("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}




    

    
}
