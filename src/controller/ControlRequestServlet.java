package controller;

import java.io.IOException;

import org.apache.tomcat.jakartaee.commons.lang3.StringUtils;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/ControlRequestServlet")
public class ControlRequestServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        req.setCharacterEncoding("UTF-8");
        String game = req.getParameter("game");
        String name = req.getParameter("name");
        // resp.setHeader("Cache-Control", "no-cache");

        if (StringUtils.isEmpty(game) || StringUtils.isEmpty(name)) {
            resp.sendRedirect("/BrowserGames/wrongrequest.html");
        } else if (game.equals("tetris")) {
            resp.sendRedirect("/BrowserGames/tetris.html?name=" + name);
        } else if (game.equals("shooting")) {
            resp.sendRedirect("/BrowserGames/shooting.html?name=" + name);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        // TODO Auto-generated method stub
        // super.doPost(req, resp);
        // ServletContext servletContext = req.getServletContext();
        // servletContext.log("POST: ControlRequestServlet called, congraturations!",
        // null);
    }

}
