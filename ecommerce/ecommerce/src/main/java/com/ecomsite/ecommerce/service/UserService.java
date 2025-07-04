package com.ecomsite.ecommerce.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecomsite.ecommerce.domain.User;
import com.ecomsite.ecommerce.repo.UserRepo;

@Service
public class UserService {

    private final UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public User addUser(User user) {
        if (userRepo.existsById(user.getCin())) {
            throw new IllegalStateException("A user with this CIN already exists.");
        }

        // Encode password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCode(UUID.randomUUID().toString());
        return userRepo.save(user); 
    }

    public List<User> findAllUsers() {
        return userRepo.findAll();
    }

    @Transactional
    public void deleteUser(String cin) {
        User user = userRepo.findUserByCin(cin);
        if (user == null) {
            throw new IllegalArgumentException("User with CIN " + cin + " not found.");
        }
        userRepo.deleteUserByCin(cin);
    }

    public User findUserByCin(String cin) {
        return userRepo.findUserByCin(cin);
    }

    @Transactional
    public User updateUserByCin(String cin, User updatedUser) {
        User existingUser = userRepo.findUserByCin(cin);
        if (existingUser == null) {
            throw new IllegalArgumentException("User with CIN " + cin + " not found.");
        }

        if (updatedUser.getUsername() != null) {
            existingUser.setUsername(updatedUser.getUsername());
        }
        if (updatedUser.getEmail() != null) {
            existingUser.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getPassword() != null) {
            // Encode password before updating
            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }
        if (updatedUser.getPhone() != null) {
            existingUser.setPhone(updatedUser.getPhone());
        }
        if (updatedUser.getRole() != null) {
            existingUser.setRole(updatedUser.getRole());
        }
        if (updatedUser.getCity() != null) {
            existingUser.setCity(updatedUser.getCity());
        }
        if (updatedUser.getImageUrl() != null) {
            existingUser.setImageUrl(updatedUser.getImageUrl());
        }

        return userRepo.save(existingUser);
    }

    public User findUserByEmail(String email) {
        return userRepo.findUserByEmail(email);
    }
}
