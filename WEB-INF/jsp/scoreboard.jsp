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
Integer num_of_user = (Integer)request.getAttribute("num_of_user");
%>
<!DOCTYPE>
<html>
<head>
    <title>Score Board</title>
    <link rel="stylesheet" href="/BrowserGames/css/style.css">
</head>
<body>
    <%=user%>さんのスコアは<%=score%>でした。<br>
    <%=num_of_user%>人中、<%=rank%>位です。
    <%if (num_of_user > 10 && rank <= 10) {%>
        トップ10おめでとうございます！
    <%}%>
    <br>
    トップ10人：<br>
    <table border="1">
    <tr>
        <th id="rank">順位</th><th id="name">名前</th><th id="score">スコア</th>
    </tr>
    <%
    if (scorelist != null) {
        for (int i = 0; i < scorelist.size(); i++) {
            %>
            <tr>
                <td><%=i+1%></td><td><%=scorelist.get(i).getUser()%></td><td><%=scorelist.get(i).getScore()%></td>
            </tr>
            <%
        }
    }
    %>
    </table>
    <br>
    <a href="/BrowserGames/index.jsp">back to home</a>
</body>
</html>
