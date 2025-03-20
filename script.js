document.addEventListener("DOMContentLoaded", function () {
  d3.csv("project_heart_disease.csv").then(function (data) {
    console.log("Data loaded", data);

    // Filter data to include only rows where “Heart Disease Status” = “yes”
    //data = data.filter(d => d["Heart Disease Status"] == "Yes");
    console.log("Filtered Data", data);

    // Data cleaning
    // let ages = data.map((d) => +d.Age).filter((d) => !isNaN(d));
    // let bloodPressures = data
    //   .map((d) => +d["Blood Pressure"])
    //   .filter((d) => !isNaN(d));
    // let cholesterols = data
    //   .map((d) => +d["Cholesterol Level"])
    //   .filter((d) => !isNaN(d));
    // let bmis = data.map((d) => +d["BMI"]).filter((d) => !isNaN(d));

    // let median = (arr) => {
    //   arr.sort((a, b) => a - b);
    //   let mid = Math.floor(arr.length / 2);
    //   return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
    // };

    // let mode = (arr) => {
    //   let freq = {};
    //   arr.forEach((val) => (freq[val] = (freq[val] || 0) + 1));
    //   return Object.keys(freq).reduce((a, b) => (freq[a] > freq[b] ? a : b));
    // };

    // data.forEach((d) => {
    //   d.Age = d.Age ? +d.Age : median(ages);
    //   d.Smoking = d.Smoking || mode(data.map((d) => d.Smoking).filter(Boolean));
    //   d["Exercise Habits"] =
    //     d["Exercise Habits"] ||
    //     mode(data.map((d) => d["Exercise Habits"]).filter(Boolean));
    //   d["Alcohol Consumption"] =
    //     d["Alcohol Consumption"] && d["Alcohol Consumption"].trim() !== ""
    //       ? d["Alcohol Consumption"]
    //       : "Unknown";
    //   d.Gender = d.Gender || mode(data.map((d) => d.Gender).filter(Boolean));
    //   d["Family Heart Disease"] =
    //     d["Family Heart Disease"] ||
    //     mode(data.map((d) => d["Family Heart Disease"]).filter(Boolean));
    //   d["Stress Level"] =
    //     d["Stress Level"] ||
    //     mode(data.map((d) => d["Stress Level"]).filter(Boolean));
    //   d["Blood Pressure"] = d["Blood Pressure"]
    //     ? +d["Blood Pressure"]
    //     : median(bloodPressures);
    //   d["Cholesterol Level"] = d["Cholesterol Level"]
    //     ? +d["Cholesterol Level"]
    //     : median(cholesterols);
    //   d.BMI = d.BMI ? +d.BMI : median(bmis);
    // });

    // console.log("Cleaned Data", data);

    // Thêm button sắp xếp và reset
    // d3.select("body")
    //   .append("button")
    //   .text("Sort by Count")
    //   .on("click", function () {
    //     resetBody();
    //     drawAgeDistribution(data, true);
    //     drawSmokingImpact(data, true);
    //     drawExerciseImpact(data, true);
    //     drawLifestyleInfluence(data, true);
    //   });

    // d3.select("body")
    //   .append("button")
    //   .text("Reset Order")
    //   .on("click", function () {
    //     resetBody();
    //     drawAgeDistribution(data);
    //     drawSmokingImpact(data);
    //     drawExerciseImpact(data);
    //     drawLifestyleInfluence(data);
    //   });

    document
      .getElementById("sort-button")
      .addEventListener("click", function () {
        resetCharts();
        drawAgeDistribution(data, true);
        drawSmokingImpact(data, true);
        drawExerciseImpact(data, true);
        drawLifestyleInfluence(data, true);
      });

    document
      .getElementById("reset-button")
      .addEventListener("click", function () {
        resetCharts();
        drawAgeDistribution(data);
        drawSmokingImpact(data);
        drawExerciseImpact(data);
        drawLifestyleInfluence(data);
      });

    drawAgeDistribution(data);
    drawSmokingImpact(data);
    drawExerciseImpact(data);
    drawLifestyleInfluence(data);
  });

  function resetCharts() {
    document.getElementById("charts").innerHTML = `
      <div id="age-distribution">
          <h2>Age Distribution</h2>
      </div>
      <div id="smoking-impact">
          <h2>Smoking Impact</h2>
      </div>
      <div id="exercise-impact">
          <h2>Exercise Impact</h2>
      </div>
      <div id="lifestyle-influence">
          <h2>Lifestyle Influence</h2>
      </div>
    `;
  }

  function drawAxisLabels(svg, width, height, xLabel, yLabel) {
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text(xLabel);

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text(yLabel);
  }

  function drawAgeDistribution(data, isSortByCount = false) {
    const width = 700,
      height = 400;
    const margin = { top: 50, right: 50, bottom: 80, left: 60 };

    const svg = d3
      .select("#age-distribution")
      .html("")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Nhóm dữ liệu theo độ tuổi và trạng thái bệnh tim
    const ageGroups = d3.rollup(
      data,
      (v) => ({
        Yes: v.filter((d) => d["Heart Disease Status"] === "Yes").length,
        No: v.filter((d) => d["Heart Disease Status"] === "No").length,
      }),
      (d) => Math.floor(+d.Age / 10) * 10 || "Undefined"
    );

    let counts = Array.from(ageGroups, ([age, counts]) => ({
      age,
      Yes: counts.Yes,
      No: counts.No,
    })).sort((a, b) => a.age.toString().localeCompare(b.age.toString()));

    if (isSortByCount) {
      counts = counts.sort((a, b) => a.Yes + a.No - (b.Yes + b.No));
    }

    // Thang đo
    const x = d3
      .scaleBand()
      .domain(counts.map((d) => d.age))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(counts, (d) => d.Yes + d.No) * 1.1])
      .range([height, 0]);

    // Màu sắc dịu mắt
    const color = d3
      .scaleOrdinal()
      .domain(["Yes", "No"])
      .range(["#E74C3C", "#2ECC71"]); // Đỏ dịu & Xanh dịu

    // Chuẩn bị dữ liệu stack
    const stack = d3.stack().keys(["Yes", "No"])(counts);

    // Tạo tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #ddd")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("box-shadow", "0px 0px 10px rgba(0,0,0,0.2)")
      .style("visibility", "hidden")
      .style("font-size", "14px");

    // Vẽ trục X và Y
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    // Vẽ cột chồng
    svg
      .selectAll("g.series")
      .data(stack)
      .enter()
      .append("g")
      .attr("class", "series")
      .attr("fill", (d) => color(d.key))
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.data.age))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .on("mouseover", function (event, d) {
        tooltip
          .style("visibility", "visible")
          .text(`${d[1] - d[0]}`)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px");
        d3.select(this).attr("opacity", 0.8);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("opacity", 1);
      });

    // Thêm nhãn hiển thị tổng số người trên mỗi cột
    svg
      .selectAll("text.label")
      .data(counts)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.age) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.Yes + d.No) - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-size", "12px")
      .text((d) => d.Yes + d.No);

    // Thêm chú thích cho màu
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 20}, -10)`);

    ["Yes", "No"].forEach((d, i) => {
      legend
        .append("rect")
        .attr("x", 0)
        .attr("y", i * 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color(d));

      legend
        .append("text")
        .attr("x", 20)
        .attr("y", i * 20 + 12)
        .text(d)
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle");
    });

    drawAxisLabels(svg, width, height, "Age Groups", "Number of People");
  }

  function drawSmokingImpact(data, isSortByCount = false) {
    const width = 700,
      height = 400;
    const margin = { top: 50, right: 50, bottom: 80, left: 60 };

    const svg = d3
      .select("#smoking-impact")
      .html("")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Nhóm dữ liệu theo tình trạng hút thuốc và trạng thái bệnh tim
    const smokingGroups = d3.rollup(
      data,
      (v) => ({
        Yes: v.filter((d) => d["Heart Disease Status"] === "Yes").length,
        No: v.filter((d) => d["Heart Disease Status"] === "No").length,
      }),
      (d) => d.Smoking || "Undefined"
    );

    let counts = Array.from(smokingGroups, ([smoking, counts]) => ({
      smoking,
      Yes: counts.Yes,
      No: counts.No,
    }));

    if (isSortByCount) {
      counts = counts.sort((a, b) => a.Yes + a.No - (b.Yes + b.No));
    }

    // Thang đo
    const x = d3
      .scaleBand()
      .domain(counts.map((d) => d.smoking))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(counts, (d) => d.Yes + d.No) * 1.1])
      .range([height, 0]);

    // Màu sắc dịu mắt
    const color = d3
      .scaleOrdinal()
      .domain(["Yes", "No"])
      .range(["#E74C3C", "#2ECC71"]); // Đỏ dịu & Xanh dịu

    // Chuẩn bị dữ liệu stack
    const stack = d3.stack().keys(["Yes", "No"])(counts);

    // Tạo tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #ddd")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("box-shadow", "0px 0px 10px rgba(0,0,0,0.2)")
      .style("visibility", "hidden")
      .style("font-size", "14px");

    // Vẽ trục X và Y
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    // Vẽ cột chồng
    svg
      .selectAll("g.series")
      .data(stack)
      .enter()
      .append("g")
      .attr("class", "series")
      .attr("fill", (d) => color(d.key))
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.data.smoking))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .on("mouseover", function (event, d) {
        tooltip
          .style("visibility", "visible")
          .text(`${d[1] - d[0]}`)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px");
        d3.select(this).attr("opacity", 0.8);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("opacity", 1);
      });

    // Thêm nhãn hiển thị tổng số người trên mỗi cột
    svg
      .selectAll("text.label")
      .data(counts)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.smoking) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.Yes + d.No) - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-size", "12px")
      .text((d) => d.Yes + d.No);

    // Thêm chú thích cho màu
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 20}, -10)`);

    ["Yes", "No"].forEach((d, i) => {
      legend
        .append("rect")
        .attr("x", 0)
        .attr("y", i * 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color(d));

      legend
        .append("text")
        .attr("x", 20)
        .attr("y", i * 20 + 12)
        .text(d)
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle");
    });

    drawAxisLabels(svg, width, height, "Smoking Status", "Number of People");
  }

  function drawExerciseImpact(data, isSortByCount = false) {
    const width = 700,
      height = 400;
    const margin = { top: 50, right: 50, bottom: 80, left: 60 };

    const svg = d3
      .select("#exercise-impact")
      .html("")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Nhóm dữ liệu theo mức độ tập thể dục và trạng thái bệnh tim
    const exerciseGroups = d3.rollup(
      data,
      (v) => ({
        Yes: v.filter((d) => d["Heart Disease Status"] === "Yes").length,
        No: v.filter((d) => d["Heart Disease Status"] === "No").length,
      }),
      (d) => (d["Exercise Habits"] || "Undefined").trim()
    );

    const customOrder = ["High", "Medium", "Low", "Undefined"];

    let counts = Array.from(exerciseGroups, ([exercise, counts]) => ({
      exercise,
      Yes: counts.Yes,
      No: counts.No,
    })).sort(
      (a, b) =>
        customOrder.indexOf(a.exercise) - customOrder.indexOf(b.exercise)
    );

    if (isSortByCount) {
      counts = counts.sort((a, b) => a.Yes + a.No - (b.Yes + b.No));
    }

    // Thang đo
    const x = d3
      .scaleBand()
      .domain(counts.map((d) => d.exercise))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(counts, (d) => d.Yes + d.No) * 1.1])
      .range([height, 0]);

    // Màu sắc dịu mắt
    const color = d3
      .scaleOrdinal()
      .domain(["Yes", "No"])
      .range(["#E74C3C", "#2ECC71"]); // Đỏ dịu & Xanh dịu

    // Chuẩn bị dữ liệu stack
    const stack = d3.stack().keys(["Yes", "No"])(counts);

    // Tạo tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #ddd")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("box-shadow", "0px 0px 10px rgba(0,0,0,0.2)")
      .style("visibility", "hidden")
      .style("font-size", "14px");

    // Vẽ trục X và Y
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    // Vẽ cột chồng
    svg
      .selectAll("g.series")
      .data(stack)
      .enter()
      .append("g")
      .attr("class", "series")
      .attr("fill", (d) => color(d.key))
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.data.exercise))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .on("mouseover", function (event, d) {
        tooltip
          .style("visibility", "visible")
          .text(`${d[1] - d[0]}`)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px");
        d3.select(this).attr("opacity", 0.8);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("opacity", 1);
      });

    // Thêm nhãn hiển thị tổng số người trên mỗi cột
    svg
      .selectAll("text.label")
      .data(counts)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.exercise) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.Yes + d.No) - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-size", "12px")
      .text((d) => d.Yes + d.No);

    // Thêm chú thích cho màu
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 20}, 10)`);

    ["Yes", "No"].forEach((d, i) => {
      legend
        .append("rect")
        .attr("x", 0)
        .attr("y", i * 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color(d));

      legend
        .append("text")
        .attr("x", 20)
        .attr("y", i * 20 + 12)
        .text(d)
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle");
    });

    drawAxisLabels(svg, width, height, "Exercise Habits", "Number of People");
  }

  // function drawLifestyleInfluence(data, isSortByCount = false) {
  //   const width = 900;
  //   const height = 520;
  //   const margin = { top: 50, right: 50, bottom: 120, left: 80 };

  //   const svg = d3
  //     .select("#lifestyle-influence")
  //     .append("svg")
  //     .attr("width", width)
  //     .attr("height", height)
  //     .append("g")
  //     .attr("transform", `translate(${margin.left}, ${margin.top})`);

  //   const lifestyleGroups = d3.rollup(
  //     data,
  //     (v) => v.length,
  //     (d) => {
  //       const smoking =
  //         d.Smoking === "Yes" || d.Smoking === "No" ? d.Smoking : "Undefined";
  //       //const alcohol = ["None", "Low", "Medium", "High"].includes(
  //       const alcohol = ["Unknown", "Low", "Medium", "High"].includes(
  //         (d["Alcohol Consumption"] || "").trim()
  //       )
  //         ? d["Alcohol Consumption"].trim()
  //         : "Undefined";
  //       const exercise = ["Low", "Medium", "High"].includes(
  //         (d["Exercise Habits"] || "").trim()
  //       )
  //         ? d["Exercise Habits"]
  //         : "Undefined";
  //       return `${smoking}-${alcohol}-${exercise}`;
  //     }
  //   );

  //   let counts = Array.from(lifestyleGroups, ([lifestyle, count]) => ({
  //     lifestyle,
  //     count,
  //   }));

  //   if (isSortByCount) {
  //     counts = counts.sort((a, b) => a.count - b.count);
  //   }

  //   const x = d3
  //     .scaleBand()
  //     .domain(counts.map((d) => d.lifestyle))
  //     .range([0, width - margin.left - margin.right])
  //     .padding(0.2);

  //   const y = d3
  //     .scaleLinear()
  //     .domain([0, d3.max(counts, (d) => d.count) * 1.1])
  //     .range([height - margin.top - margin.bottom, 0]);

  //   svg
  //     .append("g")
  //     .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
  //     .call(d3.axisBottom(x))
  //     .selectAll("text")
  //     .attr("transform", "rotate(-30)")
  //     .style("text-anchor", "end");

  //   svg.append("g").call(d3.axisLeft(y));

  //   svg
  //     .append("text")
  //     .attr("x", (width - margin.left - margin.right) / 2)
  //     .attr("y", -30)
  //     .attr("text-anchor", "middle")
  //     .style("font-size", "20px")
  //     .text("Smoking - Alcohol - Exercise Habits Classification");

  //   svg
  //     .selectAll("rect")
  //     .data(counts)
  //     .enter()
  //     .append("rect")
  //     .attr("x", (d) => x(d.lifestyle))
  //     .attr("y", (d) => y(d.count))
  //     .attr("width", x.bandwidth())
  //     .attr("height", (d) => height - margin.top - margin.bottom - y(d.count))
  //     .attr("fill", "purple");

  //   svg
  //     .selectAll("text.label")
  //     .data(counts)
  //     .enter()
  //     .append("text")
  //     .attr("class", "label")
  //     .attr("x", (d) => x(d.lifestyle) + x.bandwidth() / 2)
  //     .attr("y", (d) => y(d.count) - 10)
  //     .attr("text-anchor", "middle")
  //     .attr("fill", "black")
  //     .style("font-size", "12px")
  //     .text((d) => d.count);

  //   drawAxisLabels(svg, 700, 400, "Lifestyle Combination", "Number of People");
  // }

  function drawLifestyleInfluence(data) {
    const width = 1000; // Điều chỉnh width hợp lý
    const height = 600; // Điều chỉnh height hợp lý
    const margin = { top: 50, right: 250, bottom: 150, left: 160 }; // Tăng left để tránh đè nhãn Y

    // Xử lý nhóm tuổi và nhóm lối sống
    data.forEach((d) => {
      d["Age Group"] =
        isNaN(d.Age) || +d.Age < 10
          ? "Undefined"
          : Math.floor(+d.Age / 10) * 10;
      d["Lifestyle"] = `${d.Smoking || "Unknown"} | ${
        d["Alcohol Consumption"] || "Unknown"
      } | ${d["Exercise Habits"] || "Unknown"}`;
    });

    // Nhóm dữ liệu theo nhóm tuổi và lối sống
    const groupedData = d3.rollup(
      data,
      (v) => ({
        Yes: v.filter((d) => d["Heart Disease Status"] === "Yes").length,
        No: v.filter((d) => d["Heart Disease Status"] === "No").length,
        Total: v.length,
        Risk:
          v.length === 0
            ? 0
            : v.filter((d) => d["Heart Disease Status"] === "Yes").length /
              v.length,
      }),
      (d) => d["Age Group"],
      (d) => d["Lifestyle"]
    );

    // Chuyển dữ liệu thành mảng phù hợp
    let formattedData = [];
    groupedData.forEach((lifestyles, ageGroup) => {
      lifestyles.forEach((counts, lifestyle) => {
        formattedData.push({
          ageGroup,
          lifestyle,
          Risk: counts.Risk,
        });
      });
    });

    //Danh sách nhóm tuổi (sắp xếp để Undefined ở cuối)
    const ageGroups = [...new Set(formattedData.map((d) => d.ageGroup))].sort(
      (a, b) => (a === "Undefined" ? -1 : b === "Undefined" ? 1 : a - b)
    );

    const lifestyles = [...new Set(formattedData.map((d) => d.lifestyle))];

    // Thiết lập kích thước SVG
    const svg = d3
      .select("#lifestyle-influence")
      .html("")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Thang đo
    const x = d3.scaleBand().domain(ageGroups).range([0, width]).padding(0.2);
    const y = d3.scaleBand().domain(lifestyles).range([height, 0]).padding(0.2);
    const color = d3.scaleSequential(d3.interpolateReds).domain([0, 1]);

    // Vẽ trục X và Y
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    // Tạo tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #ddd")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("box-shadow", "0px 0px 10px rgba(0,0,0,0.2)")
      .style("visibility", "hidden")
      .style("font-size", "14px");

    // Vẽ Heatmap
    svg
      .selectAll()
      .data(formattedData)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.ageGroup))
      .attr("y", (d) => y(d.lifestyle))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", (d) => color(d.Risk))
      .on("mouseover", function (event, d) {
        tooltip
          .style("visibility", "visible")
          .html(
            `Age Group: ${d.ageGroup}<br>Lifestyle: ${d.lifestyle}<br>Risk: ${(
              d.Risk * 100
            ).toFixed(1)}%`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px");
        d3.select(this).attr("opacity", 0.8);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("opacity", 1);
      });

    // Thêm tiêu đề
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("Lifestyle Impact on Heart Disease Risk Across Age Groups");

    // Nhãn trục X
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + 50)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Age Groups");

    // **Di chuyển nhãn trục Y xa hơn**
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -140) // Đẩy ra xa hơn (trước là -50, rồi -110)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text(
        "Lifestyle Combination (Smoking - Alcohol Consumption - Exercise Habits)"
      );

    // **Thêm chú thích (Legend)**
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width + 60}, 50)`); // Dịch ra xa để không chồng lên nhãn Y

    const legendScale = d3.scaleLinear().domain([0, 1]).range([100, 0]);

    const legendAxis = d3
      .axisRight(legendScale)
      .ticks(5)
      .tickFormat(d3.format(".0%"));

    const legendGradient = legend
      .append("defs")
      .append("linearGradient")
      .attr("id", "legend-gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");

    legendGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", d3.interpolateReds(0));
    legendGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", d3.interpolateReds(1));

    legend
      .append("rect")
      .attr("width", 15)
      .attr("height", 100)
      .style("fill", "url(#legend-gradient)");

    legend.append("g").attr("transform", `translate(15,0)`).call(legendAxis);
  }
});
