package controller;

import java.io.IOException;
import java.util.List;

import org.apache.tomcat.jakartaee.commons.lang3.StringUtils;

import dao.ScoreDAO;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.Score;
import model.SelectLimit;

@WebServlet("/ControlRequestServlet")
public class ControlRequestServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        req.setCharacterEncoding("UTF-8");
        String game = req.getParameter("game");
        String name = req.getParameter("name");
        // resp.setHeader("Cache-Control", "no-cache");

        if (StringUtils.isEmpty(game) || StringUtils.isEmpty(name)) {
            resp.sendRedirect("/BrowserGames/pages/common/wrongrequest.html");
        } else if (game.equals("tetris")) {
            resp.sendRedirect("/BrowserGames/pages/tetris/tetris.html?name=" + name);
        } else if (game.equals("shooting")) {
            resp.sendRedirect("/BrowserGames/pages/shooting/shooting.html?name=" + name);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        // TODO Auto-generated method stub
        // super.doPost(req, resp);
        // ServletContext servletContext = req.getServletContext();
        // servletContext.log("POST: ControlRequestServlet called, congraturations!",
        // null);

        req.setCharacterEncoding("UTF-8");
        String game = req.getParameter("game");
        String user = req.getParameter("user");
        String scoreString = req.getParameter("score");
        int scoreInt = scoreString == null ? 0 : Integer.parseInt(scoreString);
        String disp = "/WEB-INF/jsp/scoreboard.jsp";

        ServletContext servletContext = req.getServletContext();
        servletContext.log("[DEBUG]game:" + game + ", user:" + user + ", score:" + scoreInt);

        int rank = -1;
        List<Score> scoreList = null;
        int numOfUser = 0;
        try {

            ScoreDAO scoreDAO = new ScoreDAO();
            Score score = new Score(user, game, scoreInt);
            scoreDAO.upsertScore(score);
            rank = scoreDAO.findRank(score);
            scoreList = scoreDAO.findTopN(score, new SelectLimit(10));
            numOfUser = scoreDAO.countAll(score);

        } catch (Exception e) {

            e.printStackTrace();
        }

        req.setAttribute("rank", Integer.valueOf(rank));
        req.setAttribute("scorelist", scoreList);
        req.setAttribute("num_of_user", numOfUser);

        RequestDispatcher requestDispatcher = req.getRequestDispatcher(disp);
        requestDispatcher.forward(req, resp);
    }
}
