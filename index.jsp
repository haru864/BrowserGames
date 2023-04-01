<%@ page language="java" contentType="text/html; charset=UTF-8" 
pageEncoding="UTF-8" %>
<!DOCTYPE>
<html>
<head>
<title>Browser Games</title>
</head>
<body>
<form action="/BrowserGames/ControlRequestServlet" method="GET">
name:<br>
<input type="text" name="name"><br>
game:<br>
Tetris<input type="radio" name="game" value="tetris"><br>
Shooting<input type="radio" name="game" value="shooting"><br>
<input type="submit" value="play">
</form>
</body>
</html>