package com.ecomsite.ecommerce.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecomsite.ecommerce.domain.User;


public interface UserRepo extends JpaRepository<User, String> {

    void deleteUserByCin(String cin); 

    User findUserByCin(String cin);

   

    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    User findUserByEmail(String email);



    
}