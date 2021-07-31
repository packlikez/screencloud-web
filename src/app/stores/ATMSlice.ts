import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import http from "../../utils/http";
import { RootState } from "../store";

export interface ATMState {
  notes: number[];
  noteCounts: number[];
  noteOuts: number[];
  status: "idle" | "loading" | "failed" | "loggedIn" | "success";
}

const initialState: ATMState = {
  notes: [5, 10, 20],
  noteCounts: [10, 10, 10],
  noteOuts: [0, 0, 0],
  status: "idle",
};

export const checkPIN = createAsyncThunk(
  "ATM/checkPIN",
  async (pin: string) => {
    const url = "/pin";
    const response = await http.post(url, { pin });
    return response.data.currentBalance;
  }
);

interface Result {
  value: number;
  counts: number[];
}

const MapValue = new Map();

function getNoteCount(
  value: number,
  notes: number[],
  counts: number[]
): Result[] {
  const key = `${value}-${counts.join(",")}`;
  const mapValue = MapValue.get(key);
  if (mapValue) return [];

  if (value <= 0) {
    return [{ value, counts }];
  }

  const availableNoteIndex = [];
  for (let i = 0; i < counts.length; i++) {
    if (counts[i] > 0) availableNoteIndex.push(i);
  }
  const list = [];

  for (let i = 0; i < availableNoteIndex.length; i++) {
    const index = availableNoteIndex[i];
    const newCount = [...counts];
    newCount[index]--;
    const newValue = value - notes[index];

    list.push(...getNoteCount(newValue, notes, newCount));
  }
  MapValue.set(key, list);
  return list;
}

function getNewCount(result: Result[], noteCounts: number[]) {
  const sorted = result.sort((a, b) => b.value - a.value);
  const minValue = sorted[0].value;

  if (minValue !== 0) return noteCounts;

  const filtered = sorted.filter((item) => item.value === minValue);
  const combination = filtered.map((item) =>
    item.counts.map((c, i) => noteCounts[i] - c)
  );

  let mostEvenIndex = 0;
  let min = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < combination.length; i++) {
    const curCom = combination[i];
    const sorted = [...curCom].sort((a, b) => b - a);
    const reduce = curCom
      .map((item) => sorted[0] - item)
      .reduce((acc, cur) => acc + cur, 0);
    if (reduce < min) {
      min = reduce;
      mostEvenIndex = i;
    }
  }
  const chosen = combination[mostEvenIndex];
  return noteCounts.map((count, index) => count - chosen[index]);
}

export const ATMSlice = createSlice({
  name: "ATM",
  initialState,
  reducers: {
    reset: (state) => {
      return Object.assign(state, { ...initialState, status: "loggedIn" });
    },
    withdraw: (state, action: PayloadAction<number>) => {
      MapValue.clear();
      const result = getNoteCount(
        action.payload,
        [...state.notes],
        [...state.noteCounts]
      );
      if (result.length === 0) return state;

      const newCounts = getNewCount(result, [...state.noteCounts]);
      state.noteOuts = state.noteCounts.map((count, i) => count - newCounts[i]);
      state.noteCounts = newCounts;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkPIN.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkPIN.fulfilled, (state) => {
        state.status = "loggedIn";
      })
      .addCase(checkPIN.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export const selectATM = (state: RootState) => state.ATM;

export const { withdraw, reset } = ATMSlice.actions;

export default ATMSlice.reducer;
