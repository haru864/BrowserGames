package filter;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.mysql.cj.util.StringUtils;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;

@WebFilter("/*")
public class LoggingRequestFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        request.setCharacterEncoding("UTF-8");
        Date date = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
        StringBuffer requestURL = ((HttpServletRequest) request).getRequestURL();
        String queryString = ((HttpServletRequest) request).getQueryString();
        if (StringUtils.isNullOrEmpty(queryString)) {
            queryString = "";
        }
        String referer = ((HttpServletRequest) request).getHeader("referer");

        ServletContext servletContext = request.getServletContext();
        servletContext.log(
                "\n[BrowserGames]" + dateFormat.format(date) + ", referer:" + referer + ", Request:" + requestURL
                        + queryString,
                null);

        chain.doFilter(request, response);
    }
}
