import json
from collections import defaultdict

def load_movies():
    """Read movies from a JSON file or return sample data."""
    try:
        with open("../src/data/movies.js", "r") as f:
            content = f.read()
        start = content.index("[")
        end = content.rindex("]") + 1
        data = json.loads(content[start:end])
        return data
    except Exception:
        return [
            {"id": 1, "title": "Spirit", "genre": "Action", "rating": 8.2, "language": "Telugu",
             "districts": ["Visakhapatnam", "Guntur", "Vijayawada", "Tirupati"]},
            {"id": 5, "title": "RRR", "genre": "Action", "rating": 8.9, "language": "Telugu",
             "districts": ["Visakhapatnam", "Guntur", "Vijayawada", "Tirupati", "Kurnool", "Rajahmundry", "Kakinada"]}
        ]

def analyze_by_district(movies):
    district_movies = defaultdict(list)
    district_ratings = defaultdict(list)
    all_theatres = set()

    for movie in movies:
        title = movie.get("title", "Unknown")
        districts = movie.get("districts", [])
        rating = movie.get("rating", 0)
        language = movie.get("language", "Unknown")
        theatres = movie.get("theatres", {})

        for d in districts:
            district_movies[d].append(title)
            district_ratings[d].append(rating)
            if d in theatres:
                for t in theatres[d]:
                    all_theatres.add(t)

    return district_movies, district_ratings, all_theatres


def generate_report(movies):
    dm, dr, theatres = analyze_by_district(movies)
    lines = []
    lines.append("=" * 60)
    lines.append("           MOVIES BY DISTRICT - ANALYSIS REPORT")
    lines.append("=" * 60)
    lines.append(f"\nTotal Movies: {len(movies)}")
    lines.append(f"Total Districts: {len(dm)}")
    lines.append(f"Unique Theatres: {len(theatres)}")
    lines.append("-" * 60)

    for district in sorted(dm.keys()):
        lines.append(f"\n  📍 {district}")
        lines.append(f"     Movies: {', '.join(dm[district])}")
        avg = sum(dr[district]) / len(dr[district]) if dr[district] else 0
        lines.append(f"     Avg Rating: {avg:.1f}")
        lines.append(f"     Movies Count: {len(dm[district])}")

    lines.append("\n" + "-" * 60)
    lines.append("  LANGUAGE-WISE BREAKDOWN")
    lines.append("-" * 60)
    lang_count = defaultdict(int)
    for m in movies:
        lang_count[m.get("language", "Unknown")] += 1
    for lang, count in sorted(lang_count.items()):
        lines.append(f"  {lang}: {count} movie(s)")

    lines.append("\n" + "-" * 60)
    lines.append("  THEATRES REGISTERED")
    lines.append("-" * 60)
    for t in sorted(theatres):
        lines.append(f"  • {t}")

    lines.append("\n" + "=" * 60)
    lines.append("              END OF REPORT")
    lines.append("=" * 60)
    return "\n".join(lines)


def main():
    movies = load_movies()
    report = generate_report(movies)
    print(report)
    try:
        with open("district_movie_report.txt", "w", encoding="utf-8") as f:
            f.write(report)
        print(f"\nReport saved to district_movie_report.txt")
    except IOError as e:
        print(f"Error writing report: {e}")


if __name__ == "__main__":
    main()
