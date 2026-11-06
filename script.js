function calculateBMI() {
  const height = Number(document.querySelector("#height").value);
  const weight = Number(document.querySelector("#weight").value);

  const result = document.querySelector("#result");
  const state = document.querySelector("#state");

  let visual = document.querySelector("#bmi-visual");

  // 입력값 확인
  if (
    !Number.isFinite(height) ||
    !Number.isFinite(weight) ||
    height <= 0 ||
    weight <= 0
  ) {
    result.textContent = "입력값을 확인해 주세요";
    state.textContent = "키와 몸무게를 0보다 큰 숫자로 입력해 주세요.";

    if (visual) {
      visual.hidden = true;
    }

    return;
  }

  // BMI 계산
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  if (!Number.isFinite(bmi) || bmi <= 0) {
    result.textContent = "입력값을 확인해 주세요";
    state.textContent = "키와 몸무게를 다시 확인해 주세요.";

    if (visual) {
      visual.hidden = true;
    }

    return;
  }

  let status;
  let category;

  // 기존 코드의 분류 기준 유지
  if (bmi >= 25) {
    status = "비만";
    category = 3;
  } else if (bmi >= 23) {
    status = "과체중";
    category = 2;
  } else if (bmi >= 18.5) {
    status = "정상";
    category = 1;
  } else {
    status = "저체중";
    category = 0;
  }

  result.textContent = "BMI: " + bmi.toFixed(2);
  state.textContent = status;

  // HTML을 직접 수정하지 않아도 그래프가 자동으로 생성됨
  if (!visual) {
    visual = document.createElement("section");
    visual.id = "bmi-visual";
    visual.className = "bmi-visual";

    visual.innerHTML = `
      <p class="bmi-eyebrow">FOREST WELLNESS</p>
      <h2 class="bmi-title">나의 BMI는 어디쯤?</h2>
      <p class="bmi-description">
        막대 위의 표시로 현재 위치를 확인해 보세요.
      </p>

      <div class="bmi-scale" role="img">
        <div class="bmi-bubble" aria-hidden="true"></div>
        <div class="bmi-track" aria-hidden="true"></div>
        <div class="bmi-marker" aria-hidden="true"></div>

        <div class="bmi-ticks" aria-hidden="true">
          <span>10</span>
          <span style="left: 34%">18.5</span>
          <span style="left: 52%">23</span>
          <span style="left: 60%">25</span>
          <span>35</span>
        </div>
      </div>

      <div class="bmi-legend">
        <div class="bmi-category">
          <span class="bmi-dot"
                style="--category-color: #bacddd"></span>
          <strong>저체중</strong>
          <small>18.5 미만</small>
        </div>

        <div class="bmi-category">
          <span class="bmi-dot"
                style="--category-color: #709766"></span>
          <strong>정상</strong>
          <small>18.5 이상 ~ 23 미만</small>
        </div>

        <div class="bmi-category">
          <span class="bmi-dot"
                style="--category-color: #d7bb73"></span>
          <strong>과체중</strong>
          <small>23 이상 ~ 25 미만</small>
        </div>

        <div class="bmi-category">
          <span class="bmi-dot"
                style="--category-color: #c58d76"></span>
          <strong>비만</strong>
          <small>25 이상</small>
        </div>
      </div>

      <p class="bmi-note"></p>
    `;

    // 기존 결과 영역 바로 아래에 추가
    state.insertAdjacentElement("afterend", visual);
  }

  visual.hidden = false;

  // 그래프 범위: BMI 10~35
  // 범위를 벗어나면 표시를 양 끝에 고정
  const position = Math.min(
    100,
    Math.max(0, ((bmi - 10) / (35 - 10)) * 100)
  );

  visual.style.setProperty("--bmi-position", position + "%");

  visual.querySelector(".bmi-bubble").textContent =
    "나 " + bmi.toFixed(2);

  visual.querySelector(".bmi-scale").setAttribute(
    "aria-label",
    "나의 BMI " + bmi.toFixed(2) + ", " + status +
    ". 그래프 표시 범위는 10부터 35까지입니다."
  );

  // 해당 구간 강조
  visual.querySelectorAll(".bmi-category").forEach(
    function (item, index) {
      item.classList.toggle("is-active", index === category);
    }
  );

  const note = visual.querySelector(".bmi-note");

  if (bmi < 10 || bmi > 35) {
    note.textContent =
      "현재 수치가 그래프 범위(10~35)를 벗어나 끝에 표시됩니다. " +
      "말풍선에는 실제 계산값이 표시됩니다.";
  } else {
    note.textContent =
      "그래프는 BMI 10~35 구간을 표시합니다. " +
      "분류는 기존 계산 코드의 기준을 따릅니다.";
  }
}