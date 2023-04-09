package model;

public class Score {

    private String user;
    private String game;
    private int score;

    public Score(String user, String game, int score) throws NullPointerException, Exception {
        if (user == null || game == null) {
            throw new NullPointerException("user or game was null");
        }
        if (score < 0) {
            throw new Exception("score was less than zero");
        }
        this.user = user;
        this.game = game;
        this.score = score;
    }

    public String getUser() {
        return user;
    }

    public String getGame() {
        return game;
    }

    public int getScore() {
        return score;
    }
}
