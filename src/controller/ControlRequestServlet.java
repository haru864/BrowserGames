package controller;

import java.io.IOException;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/ControlRequestServlet")
public class ControlRequestServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // TODO Auto-generated method stub
        // super.doGet(req, resp);
        ServletContext servletContext = req.getServletContext();
        servletContext.log("GET: ControlRequestServlet called, congraturations!", null);
        resp.sendRedirect("/TetrisOnline/signout.jsp");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // TODO Auto-generated method stub
        // super.doPost(req, resp);
        ServletContext servletContext = req.getServletContext();
        servletContext.log("POST: ControlRequestServlet called, congraturations!", null);
    }

}
