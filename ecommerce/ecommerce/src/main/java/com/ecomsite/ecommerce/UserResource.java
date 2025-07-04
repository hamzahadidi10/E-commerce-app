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

import com.ecomsite.ecommerce.domain.User;
import com.ecomsite.ecommerce.service.UserService;


@RestController
@RequestMapping("/user")
public class UserResource {
    private final UserService userService;

    public UserResource(UserService userService){
        this.userService = userService;
    }
    
    /////////////////////////////////////////////////////////////////////////////
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers(){
        List<User> users = userService.findAllUsers();
        
        return new ResponseEntity<>(users , HttpStatus.OK);
    }
    
    ///////////////////////////////////////////////////////////////////////////////
    /*  @GetMapping("/find/{email}/{password}")
public ResponseEntity<?> getUserByEmailAndPassword(
        @PathVariable("email") String email,
        @PathVariable("password") String password) {

    User user = userService.findUserByEmailAndPassword(email, password);

    if (user == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                             .body(Map.of("message", "Invalid email or password."));
    }

    return ResponseEntity.ok(user);
}
*/

    ///////////////////////////////////////////////////////////////////////////////
     @GetMapping("/find/{cin}")
    public ResponseEntity<User> getUserByCin(@PathVariable("cin") String cin){
        User user = userService.findUserByCin(cin);
        return new ResponseEntity<>(user , HttpStatus.OK);
    }

    /////////////////////////////////////////////////////////////////////////////
    @PostMapping("/add")
    public ResponseEntity<?> addUser(@RequestBody User user) {
    try {
        User newUser = userService.addUser(user);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    } catch (IllegalStateException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT); // 409
    }
} 
    /////////////////////////////////////////////////////////////////////////
    @PutMapping("/update/{cin}")
public ResponseEntity<?> updateUser(@PathVariable("cin") String cin, @RequestBody User user) {
    try {
        User updated = userService.updateUserByCin(cin, user);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    } catch (IllegalArgumentException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    } catch (Exception e) {
        return new ResponseEntity<>("Internal server error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


    //////////////////////////////////////////////////////////////////////
    @DeleteMapping("/delete/{cin}")
    public ResponseEntity<?> deleteUser(@PathVariable("cin") String cin){
    try {
        userService.deleteUser(cin);
        return new ResponseEntity<>(HttpStatus.OK);
    } catch (IllegalArgumentException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    } catch (Exception e) {
        return new ResponseEntity<>("Internal server error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
}

