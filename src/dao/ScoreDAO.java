package dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import model.Score;
import model.SelectLimit;

public class ScoreDAO {

    private final String JDBC_URL = "jdbc:mysql://localhost:3306/browsergames";
    private final String DB_USER = "admin";
    private final String DB_PASS = "4dm1n";

    /**
     * スコアトップN件を取得
     * 
     * @param selectLimit 上位何番まで取得するか
     * @return 取得したレコード
     */
    public List<Score> findTopN(Score score, SelectLimit selectLimit) {

        List<Score> scoreList = new ArrayList<>();

        try (Connection conn = DriverManager.getConnection(JDBC_URL, DB_USER, DB_PASS)) {

            String sql = "SELECT user, game, score FROM score WHERE game = ? ORDER BY score DESC LIMIT ?";
            PreparedStatement pStmt = conn.prepareStatement(sql);
            pStmt.setString(1, score.getGame());
            pStmt.setInt(2, selectLimit.getLimit());
            ResultSet rs = pStmt.executeQuery();

            while (rs.next()) {
                String user = rs.getString("user");
                String game = rs.getString("game");
                int scoreInt = rs.getInt("score");
                scoreList.add(new Score(user, game, scoreInt));
            }

        } catch (Exception e) {

            e.printStackTrace();
            return null;
        }

        return scoreList;
    }

    /**
     * スコアの順位を取得
     * 
     * @param score 順位を確認する対象のスコア
     * @return すでに登録されているスコアの中で上位何番目に位置するか(1000位以内まで)
     *         1000位より下は一律1001位になる
     * @throws Exception SelectLimitが不正な値のときにスロー
     */
    public int findRank(Score score) throws Exception {

        int rank = 1001;

        try {

            List<Score> scoreList = findTopN(score, new SelectLimit(1000));

            if (scoreList.size() == 0) {
                rank = 1;
            } else {
                for (int i = 0; i < scoreList.size(); i++) {
                    if (scoreList.get(i).getScore() == score.getScore()) {
                        rank = i + 1;
                        break;
                    }
                }
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return rank;
    }

    /**
     * スコアを登録/更新
     * 
     * @param score 登録するスコア
     * @return 登録または更新に成功したら引数scoreをそのまま返す
     *         失敗したらnullを返す
     */
    public Score upsertScore(Score score) {

        try (Connection conn = DriverManager.getConnection(JDBC_URL, DB_USER, DB_PASS)) {

            String sql;
            PreparedStatement pStmt;

            if (isRegistered(score)) {
                sql = "UPDATE score SET score = ? WHERE user = ? AND game = ?";
                pStmt = conn.prepareStatement(sql);
                pStmt.setInt(1, score.getScore());
                pStmt.setString(2, score.getUser());
                pStmt.setString(3, score.getGame());
            } else {
                sql = "INSERT INTO score VALUES (?, ?, ?)";
                pStmt = conn.prepareStatement(sql);
                pStmt.setString(1, score.getUser());
                pStmt.setString(2, score.getGame());
                pStmt.setInt(3, score.getScore());
            }

            int numOfRowsUpdated = pStmt.executeUpdate();
            if (numOfRowsUpdated == 0) {
                return null;
            }

        } catch (Exception e) {

            e.printStackTrace();
            return null;
        }

        return score;
    }

    /**
     * ユーザが既に登録されているかどうかチェック
     * 
     * @param score 確認対象のスコア
     * @return ユーザが登録済みであればtrue、それ以外はfalseを返す
     */
    public boolean isRegistered(Score score) {

        boolean isRegistered = false;

        try (Connection conn = DriverManager.getConnection(JDBC_URL, DB_USER, DB_PASS)) {

            String sql = "SELECT COUNT(*) FROM score WHERE user = ? AND game = ?";
            PreparedStatement pStmt = conn.prepareStatement(sql);
            pStmt.setString(1, score.getUser());
            pStmt.setString(2, score.getGame());
            ResultSet rs = pStmt.executeQuery();

            rs.next();
            if (rs.getInt(1) >= 1) {
                isRegistered = true;
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return isRegistered;
    }

    /**
     * ゲームに応じて登録されているスコアの数を取得
     * 
     * @param score 確認対象のゲームに対応するスコア
     * @return スコアを登録したユーザの数
     */
    public int countAll(Score score) {

        int count = 0;
        String sql = "SELECT COUNT(*) FROM score WHERE game = ?";

        try (Connection conn = DriverManager.getConnection(JDBC_URL, DB_USER, DB_PASS)) {

            PreparedStatement pStmt = conn.prepareStatement(sql);
            pStmt.setString(1, score.getGame());
            ResultSet rs = pStmt.executeQuery();
            rs.next();
            count = rs.getInt(1);

        } catch (Exception e) {

            e.printStackTrace();
        }

        return count;
    }
}
