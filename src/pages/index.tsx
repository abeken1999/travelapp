import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

// 予算、時期、目的地を定義
type FormData = {
  budget: number;
  date: string;
  destination: string;
};

const TravelPlanner = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const apiResponses = ["1.", "2.", "3."];

  // ユーザーが選択した情報を送信
  const onSubmit = async (data: FormData) => {
    setLoading(true);

    const API_KEY = "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";
    const URL = "https://api.openai.com/v1/chat/completions";

    try {
      // 質問文の作成
      const message = `予算: ${getBudgetLabel(
        data.budget
      )}、時期: ${getMonthLabel(data.date)}、目的地: ${
        data.destination
      }を参考に観光名所や楽しみ方を3つ教えてください。`;

      // ChatGPT APIにリクエストを送信
      const response = await axios.post(
        URL,
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
          max_tokens: 600,
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      // 改行を挿入する処理
      let resultContent = response.data.choices[0].message.content;
      resultContent = resultContent.replace(/(\d+)\./g, "\n$1.");

      setResult(resultContent);
      setLoading(false);
    } catch (error) {
      console.error("APIリクエストエラー:", error);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center">旅先案内人</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 予算の入力フィールド */}
        <div className="mb-3">
          <label htmlFor="budget" className="form-label">
            予算:
          </label>
          <select {...register("budget")} className="form-select" required>
            <option value="">予算を選択してください</option>
            <option value="0">0円</option>
            <option value="10000">1万円以内</option>
            <option value="30000">3万円以内</option>
            <option value="50000">5万円以内</option>
            <option value="100000">10万円以上</option>
          </select>
        </div>

        {/* 時期の入力フィールド */}
        <div className="mb-3">
          <label htmlFor="date" className="form-label">
            時期:
          </label>
          <select {...register("date")} className="form-select" required>
            <option value="">時期を選択してください</option>
            <option value="1">1月</option>
            <option value="2">2月</option>
            <option value="3">3月</option>
            <option value="4">4月</option>
            <option value="5">5月</option>
            <option value="6">6月</option>
            <option value="7">7月</option>
            <option value="8">8月</option>
            <option value="9">9月</option>
            <option value="10">10月</option>
            <option value="11">11月</option>
            <option value="12">12月</option>
          </select>
        </div>

        {/* 目的地の入力フィールド */}
        <div className="mb-3">
          <label htmlFor="destination" className="form-label">
            目的地:
          </label>
          <select {...register("destination")} className="form-select" required>
            <option value="">地域を選択してください</option>
            <option value="北海道">北海道</option>
            <option value="東北">東北</option>
            <option value="関東">関東</option>
            <option value="中部">中部</option>
            <option value="近畿">近畿</option>
            <option value="中国・四国">中国・四国</option>
            <option value="九州">九州</option>
          </select>
        </div>

        {/* 提案ボタン */}
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            プランを提案する
          </button>
        </div>
      </form>

      {/* ローディング表示 */}
      {/* {loading && <div className="mt-3">ローディング中...</div>} */}

      {/* ローディング表示(BootStrapアニメーション) */}
      {loading && (
        <div className="progress mt-3">
          <div
            className="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            style={{ width: "100%" }}
            aria-valuenow={100}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            ローディング中...
          </div>
        </div>
      )}

      {/* 結果表示 */}
      {result && <div className="alert alert-success mt-3">{result}</div>}
    </div>
  );
};

const getBudgetLabel = (budget: number) => {
  if (budget === 0) {
    return "0円";
  } else if (budget <= 10000) {
    return "1万円以下";
  } else if (budget <= 30000) {
    return "3万円以下";
  } else if (budget <= 50000) {
    return "5万円以下";
  } else {
    return "10万円以上";
  }
};

const getMonthLabel = (date: string) => {
  const months = [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ];

  return months[parseInt(date, 10) - 1];
};

export default TravelPlanner;
