package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.User;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import util.HibernateUtil;

@WebServlet(name = "SignIn", urlPatterns = {"/SignIn"})
public class SignIn extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
      Gson gson = new Gson();
        JsonObject jsonResponse = new JsonObject();
        jsonResponse.addProperty("status", false);
        JsonObject signIn = gson.fromJson(request.getReader(), JsonObject.class);
        try {
            String mobile = signIn.get("mobile").getAsString();
            
            System.out.println(mobile);

            if (mobile.isEmpty()) {
                jsonResponse.addProperty("message", "Mobile number is required");
            } else {
                Session session = HibernateUtil.getSessionFactory().openSession();
                Criteria criteria = session.createCriteria(User.class);
                criteria.add(Restrictions.eq("contactNo", mobile));

                if (criteria.list().isEmpty()) {
                jsonResponse.addProperty("message", " User not found!");
                }else{
                    User user = (User) criteria.list().get(0);
                 jsonResponse.addProperty("status", true);
                    jsonResponse.addProperty("userId", user.getId());
                }
            }
        } catch (Exception e) {
            jsonResponse.addProperty("message", "Error: " + e.getMessage());
        }
        String responseText = gson.toJson(jsonResponse);
        response.setContentType("application/json");
        response.getWriter().write(responseText); 
    }
}
