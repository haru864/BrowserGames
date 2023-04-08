<%@ page language="java" contentType="text/html; charset=UTF-8" 
pageEncoding="UTF-8" %>
<%
request.setCharacterEncoding("UTF-8");
String user = request.getParameter("user");
String game = request.getParameter("game");
String score = request.getParameter("score");
%>
<!DOCTYPE>
<html>
<head>
<title>Score Board</title>
</head>
<body>
game:<%=game%><br>
user:<%=user%><br>
score:<%=score%><br>
</body>
</html>
