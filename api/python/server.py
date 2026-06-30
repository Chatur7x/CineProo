import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "python"))

try:
    from flask import Flask, request, jsonify
except ImportError:
    print("Flask not installed. Run: pip install flask")
    sys.exit(1)

from password_audit import Password, PasswordAuditor, AuditReport

app = Flask(__name__)


@app.route("/api/password/validate", methods=["POST"])
def validate_password():
    data = request.get_json()
    if not data or "password" not in data:
        return jsonify({"error": "Password required"}), 400
    pw = Password(data["password"])
    pw.analyze()
    return jsonify({
        "password": pw.password,
        "score": pw.score,
        "strength": pw.strength,
        "issues": pw.issues,
        "is_duplicate": pw.is_duplicate
    })


@app.route("/api/password/audit", methods=["POST"])
def audit_passwords():
    data = request.get_json()
    if not data or "passwords" not in data:
        return jsonify({"error": "Passwords list required"}), 400
    auditor = PasswordAuditor("temp.txt")
    try:
        auditor.load_passwords()
    except Exception:
        pass
    results = []
    for pwd in data["passwords"]:
        pw = Password(pwd)
        pw.analyze()
        pw.is_duplicate = data["passwords"].count(pwd) > 1
        results.append({
            "password": pw.password,
            "score": pw.score,
            "strength": pw.strength,
            "issues": pw.issues,
            "is_duplicate": pw.is_duplicate
        })
    return jsonify({"results": results})


@app.route("/api/password/policy", methods=["GET"])
def get_policy():
    return jsonify({
        "max_score": 5,
        "rules": [
            {"name": "length", "description": "Min 8 characters", "points": 1},
            {"name": "uppercase", "description": "Has uppercase letter", "points": 1},
            {"name": "lowercase", "description": "Has lowercase letter", "points": 1},
            {"name": "digit", "description": "Has digit", "points": 1},
            {"name": "special", "description": "Has special character", "points": 1}
        ],
        "strength_labels": {"strong": "4-5 points", "medium": "2-3 points", "weak": "0-1 point"}
    })


if __name__ == "__main__":
    print("Python Password API running on http://localhost:5000")
    app.run(debug=True, port=5000)
