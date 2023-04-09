package model;

public class SelectLimit {

    private int limit;

    public SelectLimit(int limit) throws Exception {
        if (limit < 1) {
            throw new Exception("score limit was less than 1");
        }
        this.limit = limit;
    }

    public int getLimit() {
        return limit;
    }
}
