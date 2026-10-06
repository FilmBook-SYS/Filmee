<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<jsp:include page="/includes/header.jsp" />

<div style="max-width: 440px; margin: 40px auto;">
  <div class="modal-box" style="position: static; margin: 0 auto; box-shadow: var(--shadow-subtle);">
    <h3 style="margin-bottom: 8px;">Sign In to Filmee</h3>
    <p class="auth-help">Enter your credentials to book tickets.</p>

    <c:if test="${not empty errorMessage}">
      <div style="background: rgba(239, 68, 68, 0.2); color: #f87171; padding: 10px; border-radius: var(--radius-sm); margin-bottom: 16px; font-size: 0.88rem;">
        ${errorMessage}
      </div>
    </c:if>

    <form action="${pageContext.request.contextPath}/auth" method="POST">
      <input type="hidden" name="action" value="login" />

      <div class="form-group">
        <label>Email Address</label>
        <input type="email" name="email" required placeholder="soham@example.com" value="soham@example.com" />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input type="password" name="password" required placeholder="••••••••" value="user123" />
      </div>

      <button type="submit" class="btn btn-primary btn-block">
        <i class="fa-solid fa-right-to-bracket"></i> Sign In
      </button>

      <div style="text-align: center; margin-top: 16px; font-size: 0.88rem; color: var(--text-secondary);">
        Don't have an account? <a href="${pageContext.request.contextPath}/auth?action=register" class="text-accent">Create One</a>
      </div>
    </form>
  </div>
</div>

<jsp:include page="/includes/footer.jsp" />
