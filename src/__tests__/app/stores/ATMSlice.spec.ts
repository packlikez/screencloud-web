import { ATMState, withdraw } from "../../../app/stores/ATMSlice";
import ATMReducer from "../../../app/stores/ATMSlice";

describe("TEST ATM Reducer", () => {
  describe("Withdraw", () => {
    it("should withdraw complete", () => {
      const initialState: ATMState = {
        notes: [5, 10, 20],
        noteCounts: [10, 10, 10],
        noteOuts: [0, 0, 0],
        status: "idle",
      };

      const actual = ATMReducer(initialState, withdraw(100));

      expect(actual).toEqual({
        notes: [5, 10, 20],
        noteCounts: [8, 7, 7],
        noteOuts: [2, 3, 3],
        status: "idle",
      });
    });

    it("should withdraw complete, when ATM has only 20£ note", () => {
      const initialState: ATMState = {
        notes: [5, 10, 20],
        noteCounts: [0, 0, 5],
        noteOuts: [0, 0, 0],
        status: "idle",
      };

      const actual = ATMReducer(initialState, withdraw(100));

      expect(actual).toEqual({
        notes: [5, 10, 20],
        noteCounts: [0, 0, 0],
        noteOuts: [0, 0, 5],
        status: "idle",
      });
    });

    it("should not withdraw, when is not enough note in ATM", () => {
      const initialState: ATMState = {
        notes: [5, 10, 20],
        noteCounts: [1, 0, 0],
        noteOuts: [0, 0, 0],
        status: "idle",
      };

      const actual = ATMReducer(initialState, withdraw(100));

      expect(actual).toEqual({
        notes: [5, 10, 20],
        noteCounts: [1, 0, 0],
        noteOuts: [0, 0, 0],
        status: "idle",
      });
    });

    it("should not withdraw, when out of notes", () => {
      const initialState: ATMState = {
        notes: [5, 10, 20],
        noteCounts: [0, 0, 0],
        noteOuts: [0, 0, 0],
        status: "idle",
      };

      const actual = ATMReducer(initialState, withdraw(100));

      expect(actual).toEqual({
        notes: [5, 10, 20],
        noteCounts: [0, 0, 0],
        noteOuts: [0, 0, 0],
        status: "idle",
      });
    });

    it("should not withdraw, when notes is not enough by not having 5", () => {
      const initialState: ATMState = {
        notes: [5, 10, 20],
        noteCounts: [0, 5, 5],
        noteOuts: [0, 0, 0],
        status: "idle",
      };

      const actual = ATMReducer(initialState, withdraw(105));

      expect(actual).toEqual({
        notes: [5, 10, 20],
        noteCounts: [0, 5, 5],
        noteOuts: [0, 0, 0],
        status: "idle",
      });
    });
  });
});
