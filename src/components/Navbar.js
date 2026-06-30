function Navbar() {
  return React.createElement("nav", { className: "navbar" },
    React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" } },
      React.createElement("span", { className: "navbar-brand", onClick: function () { window.location.hash = "#/"; } }, "CineBook"),
      React.createElement("div", { className: "syllabus-badges" },
        React.createElement("div", { className: "syllabus-badge python" },
          React.createElement("span", { className: "dot" }),
          "Python"
        ),
        React.createElement("div", { className: "syllabus-badge java" },
          React.createElement("span", { className: "dot" }),
          "Java"
        )
      )
    ),
    React.createElement("div", { className: "navbar-links" },
      React.createElement("a", { onClick: function () { window.location.hash = "#/"; } }, "Movies"),
      React.createElement("a", { onClick: function () { window.location.hash = "#/python-audit"; } }, "Audit"),
      React.createElement("a", { onClick: function () { window.location.hash = "#/java-checker"; } }, "Checker"),
      React.createElement("a", { onClick: function () { window.location.hash = "#/add-movie"; } }, "Admin"),
      React.createElement("a", { onClick: function () { window.location.hash = "#/my-bookings"; } }, "Bookings")
    )
  );
}
