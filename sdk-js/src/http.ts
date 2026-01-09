import axios from "axios";
import { EvaluationResponse } from "./types.js";

export const evaluateFlagRequest = async (
  apiUrl: string,
  payload: any
): Promise<EvaluationResponse> => {
  const res = await axios.post(
    `${apiUrl}/flags/evaluate`,
    payload
  );
  return res.data;
};
