document.getElementById("Sign-Btn").addEventListener("click", function(event){
    event.preventDefault(); 

    const userName = document.getElementById("user-name").value;
    const password = document.getElementById("Password").value;

    if(userName === "admin" && password === "admin123"){
        alert("Login successful");
        window.location.assign("home.html");
    }
    else{
        alert("Invalid username or password");
    }
});