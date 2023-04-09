<%@ page language="java" contentType="text/html; charset=UTF-8" 
pageEncoding="UTF-8" %>
<%@ page import="java.util.List, model.Score"%>
<%
request.setCharacterEncoding("UTF-8");
String user = request.getParameter("user");
String game = request.getParameter("game");
String score = request.getParameter("score");
Integer rank = (Integer)request.getAttribute("rank");
List<Score> scorelist = (List<Score>)request.getAttribute("scorelist");
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
rank:<%=rank%><br>
<%
if (scorelist != null) {
    for (int i = 0; i < scorelist.size(); i++) {
        %>
        <%=i+1%>:<%=scorelist.get(i).getUser()%>,<%=scorelist.get(i).getScore()%><br>
        <%
    }
}
%>
</body>
</html>
