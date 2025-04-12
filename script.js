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

    // Select and reset the container
    const container = d3.select("#age-distribution");
    container.select("svg").remove();

    // Create the SVG and group element
    const svg = container
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Helper: classify age into predefined groups
    const groupAge = (ageStr) => {
      if (!ageStr || isNaN(+ageStr)) return "Unknown";
      const age = +ageStr;
      if (age < 20) return "<20";
      if (age <= 30) return "20–30";
      if (age <= 40) return "30–40";
      if (age <= 50) return "40–50";
      if (age <= 60) return "50–60";
      if (age <= 70) return "60–70";
      return ">70";
    };

    // Aggregate data by age group and status
    const grouped = d3.rollup(
      data,
      (v) => ({
        Yes: v.filter((d) => d["Heart Disease Status"] === "Yes").length,
        No: v.filter((d) => d["Heart Disease Status"] === "No").length,
      }),
      (d) => groupAge(d.Age)
    );

    const ageOrder = [
      "<20",
      "20–30",
      "30–40",
      "40–50",
      "50–60",
      "60–70",
      ">70",
      "Unknown",
    ];

    // Convert to array and sort by ageOrder
    let counts = Array.from(grouped, ([age, values]) => ({
      age,
      Yes: values.Yes,
      No: values.No,
    })).sort((a, b) => ageOrder.indexOf(a.age) - ageOrder.indexOf(b.age));

    // Optional: sort by total count
    if (isSortByCount) {
      counts = counts.sort((a, b) => a.Yes + a.No - (b.Yes + b.No));
    }

    // Define scales
    const x = d3
      .scaleBand()
      .domain(counts.map((d) => d.age))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(counts, (d) => d.Yes + d.No) * 1.1])
      .range([height, 0]);

    const color = d3
      .scaleOrdinal()
      .domain(["Yes", "No"])
      .range(["#E74C3C", "#2ECC71"]);

    const stack = d3.stack().keys(["Yes", "No"])(counts);

    // Tooltip setup
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #ddd")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("box-shadow", "0 0 10px rgba(0,0,0,0.2)")
      .style("visibility", "hidden")
      .style("font-size", "14px");

    // Render X axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Render Y axis
    svg.append("g").call(d3.axisLeft(y));

    // Render stacked bars
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
        const status = d3.select(this.parentNode).datum().key; // "Yes" or "No"
        const count = d[1] - d[0];

        tooltip
          .style("visibility", "visible")
          .text(`${status}: ${count}`)
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

    // Add value labels on top of each group
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

    // Add legend
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

    // Draw axis titles (external helper function)
    drawAxisLabels(svg, width, height, "Age Groups", "Number of People");
  }

  function drawSmokingImpact(data, isSortByCount = false) {
    const width = 700,
      height = 400;
    const margin = { top: 50, right: 50, bottom: 80, left: 60 };

    // Prepare the container and remove any previous chart
    const container = d3.select("#smoking-impact");
    container.select("svg").remove();

    // Create new SVG element
    const svg = container
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Group data by Smoking status and Heart Disease status
    const grouped = d3.rollup(
      data,
      (v) => ({
        Yes: v.filter((d) => d["Heart Disease Status"] === "Yes").length,
        No: v.filter((d) => d["Heart Disease Status"] === "No").length,
      }),
      (d) => d.Smoking || "Unknown"
    );

    // Convert Map to array format
    let counts = Array.from(grouped, ([smoking, values]) => ({
      smoking,
      values: [
        { status: "Yes", count: values.Yes },
        { status: "No", count: values.No },
      ],
    }));

    // Optional: sort by total count of each group
    if (isSortByCount) {
      counts = counts.sort(
        (a, b) =>
          a.values[0].count +
          a.values[1].count -
          (b.values[0].count + b.values[1].count)
      );
    }

    // Outer band scale for Smoking groups
    const x0 = d3
      .scaleBand()
      .domain(counts.map((d) => d.smoking))
      .range([0, width])
      .paddingInner(0.2);

    // Inner band scale for Yes/No within each group
    const x1 = d3
      .scaleBand()
      .domain(["Yes", "No"])
      .range([0, x0.bandwidth()])
      .padding(0.05);

    // Linear Y scale for count values
    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(counts, (d) => d3.max(d.values, (v) => v.count)) * 1.1,
      ])
      .range([height, 0]);

    // Color encoding
    const color = d3
      .scaleOrdinal()
      .domain(["Yes", "No"])
      .range(["#E74C3C", "#2ECC71"]);

    // Draw X axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x0));

    // Draw Y axis
    svg.append("g").call(d3.axisLeft(y));

    // Tooltip setup
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #ddd")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("box-shadow", "0 0 10px rgba(0,0,0,0.2)")
      .style("visibility", "hidden")
      .style("font-size", "14px");

    // Render bars (side-by-side)
    const group = svg
      .selectAll("g.bar-group")
      .data(counts)
      .enter()
      .append("g")
      .attr("class", "bar-group")
      .attr("transform", (d) => `translate(${x0(d.smoking)}, 0)`);

    group
      .selectAll("rect")
      .data((d) => d.values)
      .enter()
      .append("rect")
      .attr("x", (d) => x1(d.status))
      .attr("y", (d) => y(d.count))
      .attr("width", x1.bandwidth())
      .attr("height", (d) => y(0) - y(d.count))
      .attr("fill", (d) => color(d.status))
      .on("mouseover", function (event, d) {
        tooltip
          .style("visibility", "visible")
          .text(`${d.status}: ${d.count}`)
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

    // ✅ Add individual labels on top of each bar (not group total)
    group
      .selectAll("text.bar-label")
      .data((d) => d.values)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", (d) => x1(d.status) + x1.bandwidth() / 2)
      .attr("y", (d) => y(d.count) - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-size", "11px")
      .text((d) => d.count);

    // Add legend for Yes/No colors
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

    // Draw axis labels (external helper)
    drawAxisLabels(svg, width, height, "Smoking Status", "Number of People");
  }

  //   const width = 700,
  //     height = 400;
  //   const margin = { top: 50, right: 50, bottom: 80, left: 60 };

  //   // const svg = d3.select("#exercise-impact").html("").append("svg");
  //   const container = d3.select("#exercise-impact");

  //   container.select("svg").remove(); // chỉ xoá biểu đồ cũ

  //   const svg = container
  //     .append("svg")
  //     .attr("width", width + margin.left + margin.right)
  //     .attr("height", height + margin.top + margin.bottom)
  //     .append("g")
  //     .attr("transform", `translate(${margin.left}, ${margin.top})`);

  //   // Nhóm dữ liệu theo mức độ tập thể dục và trạng thái bệnh tim
  //   const exerciseGroups = d3.rollup(
  //     data,
  //     (v) => ({
  //       Yes: v.filter((d) => d["Heart Disease Status"] === "Yes").length,
  //       No: v.filter((d) => d["Heart Disease Status"] === "No").length,
  //     }),
  //     (d) => (d["Exercise Habits"] || "Undefined").trim()
  //   );

  //   const customOrder = ["High", "Medium", "Low", "Undefined"];

  //   let counts = Array.from(exerciseGroups, ([exercise, counts]) => ({
  //     exercise,
  //     Yes: counts.Yes,
  //     No: counts.No,
  //   })).sort(
  //     (a, b) =>
  //       customOrder.indexOf(a.exercise) - customOrder.indexOf(b.exercise)
  //   );

  //   if (isSortByCount) {
  //     counts = counts.sort((a, b) => a.Yes + a.No - (b.Yes + b.No));
  //   }

  //   // Thang đo
  //   const x = d3
  //     .scaleBand()
  //     .domain(counts.map((d) => d.exercise))
  //     .range([0, width])
  //     .padding(0.1);

  //   const y = d3
  //     .scaleLinear()
  //     .domain([0, d3.max(counts, (d) => d.Yes + d.No) * 1.1])
  //     .range([height, 0]);

  //   // Màu sắc dịu mắt
  //   const color = d3
  //     .scaleOrdinal()
  //     .domain(["Yes", "No"])
  //     .range(["#E74C3C", "#2ECC71"]); // Đỏ dịu & Xanh dịu

  //   // Chuẩn bị dữ liệu stack
  //   const stack = d3.stack().keys(["Yes", "No"])(counts);

  //   // Tạo tooltip
  //   const tooltip = d3
  //     .select("body")
  //     .append("div")
  //     .style("position", "absolute")
  //     .style("background", "#fff")
  //     .style("border", "1px solid #ddd")
  //     .style("padding", "8px")
  //     .style("border-radius", "4px")
  //     .style("box-shadow", "0px 0px 10px rgba(0,0,0,0.2)")
  //     .style("visibility", "hidden")
  //     .style("font-size", "14px");

  //   // Vẽ trục X và Y
  //   svg
  //     .append("g")
  //     .attr("transform", `translate(0, ${height})`)
  //     .call(d3.axisBottom(x));

  //   svg.append("g").call(d3.axisLeft(y));

  //   // Vẽ cột chồng
  //   svg
  //     .selectAll("g.series")
  //     .data(stack)
  //     .enter()
  //     .append("g")
  //     .attr("class", "series")
  //     .attr("fill", (d) => color(d.key))
  //     .selectAll("rect")
  //     .data((d) => d)
  //     .enter()
  //     .append("rect")
  //     .attr("x", (d) => x(d.data.exercise))
  //     .attr("y", (d) => y(d[1]))
  //     .attr("height", (d) => y(d[0]) - y(d[1]))
  //     .attr("width", x.bandwidth())
  //     .on("mouseover", function (event, d) {
  //       tooltip
  //         .style("visibility", "visible")
  //         .text(`${d[1] - d[0]}`)
  //         .style("left", event.pageX + 10 + "px")
  //         .style("top", event.pageY - 20 + "px");
  //       d3.select(this).attr("opacity", 0.8);
  //     })
  //     .on("mousemove", function (event) {
  //       tooltip
  //         .style("left", event.pageX + 10 + "px")
  //         .style("top", event.pageY - 20 + "px");
  //     })
  //     .on("mouseout", function () {
  //       tooltip.style("visibility", "hidden");
  //       d3.select(this).attr("opacity", 1);
  //     });

  //   // Thêm nhãn hiển thị tổng số người trên mỗi cột
  //   svg
  //     .selectAll("text.label")
  //     .data(counts)
  //     .enter()
  //     .append("text")
  //     .attr("class", "label")
  //     .attr("x", (d) => x(d.exercise) + x.bandwidth() / 2)
  //     .attr("y", (d) => y(d.Yes + d.No) - 10)
  //     .attr("text-anchor", "middle")
  //     .attr("fill", "black")
  //     .style("font-size", "12px")
  //     .text((d) => d.Yes + d.No);

  //   // Thêm chú thích cho màu
  //   const legend = svg
  //     .append("g")
  //     .attr("transform", `translate(${width - 20}, 10)`);

  //   ["Yes", "No"].forEach((d, i) => {
  //     legend
  //       .append("rect")
  //       .attr("x", 0)
  //       .attr("y", i * 20)
  //       .attr("width", 15)
  //       .attr("height", 15)
  //       .attr("fill", color(d));

  //     legend
  //       .append("text")
  //       .attr("x", 20)
  //       .attr("y", i * 20 + 12)
  //       .text(d)
  //       .style("font-size", "12px")
  //       .attr("alignment-baseline", "middle");
  //   });

  //   drawAxisLabels(svg, width, height, "Exercise Habits", "Number of People");
  // }

  // function drawLifestyleInfluence(data) {
  //   const width = 1000; // Điều chỉnh width hợp lý
  //   const height = 600; // Điều chỉnh height hợp lý
  //   const margin = { top: 50, right: 250, bottom: 150, left: 160 }; // Tăng left để tránh đè nhãn Y

  //   // Xử lý nhóm tuổi và nhóm lối sống
  //   data.forEach((d) => {
  //     d["Age Group"] =
  //       isNaN(d.Age) || +d.Age < 10
  //         ? "Undefined"
  //         : Math.floor(+d.Age / 10) * 10;
  //     d["Lifestyle"] = `${d.Smoking || "Unknown"} | ${
  //       d["Alcohol Consumption"] || "Unknown"
  //     } | ${d["Exercise Habits"] || "Unknown"}`;
  //   });

  //   // Nhóm dữ liệu theo nhóm tuổi và lối sống
  //   const groupedData = d3.rollup(
  //     data,
  //     (v) => ({
  //       Yes: v.filter((d) => d["Heart Disease Status"] === "Yes").length,
  //       No: v.filter((d) => d["Heart Disease Status"] === "No").length,
  //       Total: v.length,
  //       Risk:
  //         v.length === 0
  //           ? 0
  //           : v.filter((d) => d["Heart Disease Status"] === "Yes").length /
  //             v.length,
  //     }),
  //     (d) => d["Age Group"],
  //     (d) => d["Lifestyle"]
  //   );

  //   // Chuyển dữ liệu thành mảng phù hợp
  //   let formattedData = [];
  //   groupedData.forEach((lifestyles, ageGroup) => {
  //     lifestyles.forEach((counts, lifestyle) => {
  //       formattedData.push({
  //         ageGroup,
  //         lifestyle,
  //         Risk: counts.Risk,
  //       });
  //     });
  //   });

  //   //Danh sách nhóm tuổi (sắp xếp để Undefined ở cuối)
  //   const ageGroups = [...new Set(formattedData.map((d) => d.ageGroup))].sort(
  //     (a, b) => (a === "Undefined" ? -1 : b === "Undefined" ? 1 : a - b)
  //   );

  //   const lifestyles = [...new Set(formattedData.map((d) => d.lifestyle))];

  //   // Thiết lập kích thước SVG
  //   const svg = d3
  //     .select("#lifestyle-influence")
  //     .html("")
  //     .append("svg")
  //     .attr("width", width + margin.left + margin.right)
  //     .attr("height", height + margin.top + margin.bottom)
  //     .append("g")
  //     .attr("transform", `translate(${margin.left}, ${margin.top})`);

  //   // Thang đo
  //   const x = d3.scaleBand().domain(ageGroups).range([0, width]).padding(0.2);
  //   const y = d3.scaleBand().domain(lifestyles).range([height, 0]).padding(0.2);
  //   const color = d3.scaleSequential(d3.interpolateReds).domain([0, 1]);

  //   // Vẽ trục X và Y
  //   svg
  //     .append("g")
  //     .attr("transform", `translate(0, ${height})`)
  //     .call(d3.axisBottom(x));

  //   svg.append("g").call(d3.axisLeft(y));

  //   // Tạo tooltip
  //   const tooltip = d3
  //     .select("body")
  //     .append("div")
  //     .style("position", "absolute")
  //     .style("background", "#fff")
  //     .style("border", "1px solid #ddd")
  //     .style("padding", "8px")
  //     .style("border-radius", "4px")
  //     .style("box-shadow", "0px 0px 10px rgba(0,0,0,0.2)")
  //     .style("visibility", "hidden")
  //     .style("font-size", "14px");

  //   // Vẽ Heatmap
  //   svg
  //     .selectAll()
  //     .data(formattedData)
  //     .enter()
  //     .append("rect")
  //     .attr("x", (d) => x(d.ageGroup))
  //     .attr("y", (d) => y(d.lifestyle))
  //     .attr("width", x.bandwidth())
  //     .attr("height", y.bandwidth())
  //     .attr("fill", (d) => color(d.Risk))
  //     .on("mouseover", function (event, d) {
  //       tooltip
  //         .style("visibility", "visible")
  //         .html(
  //           `Age Group: ${d.ageGroup}<br>Lifestyle: ${d.lifestyle}<br>Risk: ${(
  //             d.Risk * 100
  //           ).toFixed(1)}%`
  //         )
  //         .style("left", event.pageX + 10 + "px")
  //         .style("top", event.pageY - 20 + "px");
  //       d3.select(this).attr("opacity", 0.8);
  //     })
  //     .on("mousemove", function (event) {
  //       tooltip
  //         .style("left", event.pageX + 10 + "px")
  //         .style("top", event.pageY - 20 + "px");
  //     })
  //     .on("mouseout", function () {
  //       tooltip.style("visibility", "hidden");
  //       d3.select(this).attr("opacity", 1);
  //     });

  //   // Thêm tiêu đề
  //   svg
  //     .append("text")
  //     .attr("x", width / 2)
  //     .attr("y", -20)
  //     .attr("text-anchor", "middle")
  //     .style("font-size", "18px")
  //     .text("Lifestyle Impact on Heart Disease Risk Across Age Groups");

  //   // Nhãn trục X
  //   svg
  //     .append("text")
  //     .attr("x", width / 2)
  //     .attr("y", height + 50)
  //     .attr("text-anchor", "middle")
  //     .style("font-size", "14px")
  //     .text("Age Groups");

  //   // **Di chuyển nhãn trục Y xa hơn**
  //   svg
  //     .append("text")
  //     .attr("transform", "rotate(-90)")
  //     .attr("x", -height / 2)
  //     .attr("y", -140) // Đẩy ra xa hơn (trước là -50, rồi -110)
  //     .attr("text-anchor", "middle")
  //     .style("font-size", "14px")
  //     .text(
  //       "Lifestyle Combination (Smoking - Alcohol Consumption - Exercise Habits)"
  //     );

  //   // **Thêm chú thích (Legend)**
  //   const legend = svg
  //     .append("g")
  //     .attr("transform", `translate(${width + 60}, 50)`); // Dịch ra xa để không chồng lên nhãn Y

  //   const legendScale = d3.scaleLinear().domain([0, 1]).range([100, 0]);

  //   const legendAxis = d3
  //     .axisRight(legendScale)
  //     .ticks(5)
  //     .tickFormat(d3.format(".0%"));

  //   const legendGradient = legend
  //     .append("defs")
  //     .append("linearGradient")
  //     .attr("id", "legend-gradient")
  //     .attr("x1", "0%")
  //     .attr("y1", "100%")
  //     .attr("x2", "0%")
  //     .attr("y2", "0%");

  //   legendGradient
  //     .append("stop")
  //     .attr("offset", "0%")
  //     .attr("stop-color", d3.interpolateReds(0));
  //   legendGradient
  //     .append("stop")
  //     .attr("offset", "100%")
  //     .attr("stop-color", d3.interpolateReds(1));

  //   legend
  //     .append("rect")
  //     .attr("width", 15)
  //     .attr("height", 100)
  //     .style("fill", "url(#legend-gradient)");

  //   legend.append("g").attr("transform", `translate(15,0)`).call(legendAxis);
  // }

  // Draw a 100% stacked bar chart showing the impact of exercise habits on heart disease risk
  // Draw a 100% stacked bar chart showing the impact of exercise habits on heart disease risk
  function drawExerciseImpact(data, isSortByCount = false) {
    const width = 700;
    const height = 400;
    const margin = { top: 50, right: 120, bottom: 80, left: 60 }; // increased right for legend

    const container = d3.select("#exercise-impact");
    container.select("svg").remove();

    const svg = container
      .append("svg")
      .attr("width", width + margin.left + margin.right + 40) // extra space for legend
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Group and calculate ratio of Yes/No heart disease cases by exercise habit
    const exerciseGroups = d3.rollup(
      data,
      (v) => {
        const total = v.length;
        const yes = v.filter((d) => d["Heart Disease Status"] === "Yes").length;
        const no = v.filter((d) => d["Heart Disease Status"] === "No").length;
        return {
          Yes: yes,
          No: no,
          Total: total,
          YesRatio: yes / total,
          NoRatio: no / total,
        };
      },
      (d) => (d["Exercise Habits"] || "Undefined").trim()
    );

    const customOrder = ["High", "Medium", "Low", "Undefined"];

    // Convert and sort data
    let counts = Array.from(exerciseGroups, ([exercise, group]) => ({
      exercise,
      Yes: group.Yes,
      No: group.No,
      YesRatio: group.YesRatio,
      NoRatio: group.NoRatio,
    })).sort(
      (a, b) =>
        customOrder.indexOf(a.exercise) - customOrder.indexOf(b.exercise)
    );

    if (isSortByCount) {
      counts = counts.sort((a, b) => a.Yes + a.No - (b.Yes + b.No));
    }

    // Stack layout for normalized values
    const stack = d3
      .stack()
      .keys(["YesRatio", "NoRatio"])
      .value((d, key) => d[key])(counts);

    const x = d3
      .scaleBand()
      .domain(counts.map((d) => d.exercise))
      .range([0, width])
      .padding(0.3); // narrower bars

    const y = d3.scaleLinear().domain([0, 1]).range([height, 0]);

    const color = d3
      .scaleOrdinal()
      .domain(["YesRatio", "NoRatio"])
      .range(["#E74C3C", "#2ECC71"]);

    // X and Y axes
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y).tickFormat(d3.format(".0%")));

    // Tooltip setup
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #ddd")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("box-shadow", "0 0 10px rgba(0,0,0,0.2)")
      .style("visibility", "hidden")
      .style("font-size", "14px");

    // Draw bars
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
        const total = d.data.Yes + d.data.No;
        const value = d[1] - d[0];
        const count = Math.round(value * total);
        const status =
          d3.select(this.parentNode).datum().key === "YesRatio" ? "Yes" : "No";

        tooltip
          .style("visibility", "visible")
          .text(`${status}: ${count} (${(value * 100).toFixed(1)}%)`)
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

    // Add percentage labels
    counts.forEach((d) => {
      const xPos = x(d.exercise) + x.bandwidth() / 2;

      const yesY = y(d.YesRatio);
      const noY = y(1);

      svg
        .append("text")
        .attr("x", xPos)
        .attr("y", yesY + 14)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .style("font-size", "11px")
        .text(`${(d.YesRatio * 100).toFixed(1)}%`);

      svg
        .append("text")
        .attr("x", xPos)
        .attr("y", height - (height - y(d.NoRatio)) + 14)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .style("font-size", "11px")
        .text(`${(d.NoRatio * 100).toFixed(1)}%`);
    });

    // Legend moved out of bar area
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width + 30}, 10)`);

    [
      ["YesRatio", "Yes"],
      ["NoRatio", "No"],
    ].forEach(([key, label], i) => {
      legend
        .append("rect")
        .attr("x", 0)
        .attr("y", i * 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color(key));

      legend
        .append("text")
        .attr("x", 20)
        .attr("y", i * 20 + 12)
        .text(label)
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle");
    });

    // Axis labels
    drawAxisLabels(
      svg,
      width,
      height,
      "Exercise Habits",
      "Percentage of People"
    );
  }

  // function drawLifestyleInfluence(data) {
  //   // Tạo SVG mới trong vùng lifestyle-influence
  //   // const container = d3
  //   //   .select("#lifestyle-influence")
  //   //   .html("") // Xoá nội dung cũ (nếu có)
  //   //   .append("svg")
  //   const container = d3.select("#lifestyle-influence");
  //   container.select("svg").remove(); // xoá svg cũ nếu có

  //   const svg = container.append("svg").attr("width", 1000).attr("height", 600);

  //   const margin = { top: 50, right: 30, bottom: 120, left: 60 };
  //   const width = 1000 - margin.left - margin.right;
  //   const height = 600 - margin.top - margin.bottom;

  //   const chart = svg
  //     .append("g") // ✅ append vào SVG
  //     .attr("transform", `translate(${margin.left},${margin.top})`);

  //   // Tạo tooltip nếu chưa có
  //   let tooltip = d3.select(".tooltip");
  //   if (tooltip.empty()) {
  //     tooltip = d3
  //       .select("body")
  //       .append("div")
  //       .attr("class", "tooltip")
  //       .style("opacity", 0)
  //       .style("position", "absolute")
  //       .style("background", "#fff")
  //       .style("border", "1px solid #aaa")
  //       .style("padding", "6px 8px")
  //       .style("border-radius", "4px")
  //       .style("font-size", "12px")
  //       .style("pointer-events", "none");
  //   }

  //   // Preprocess: filter missing and create age groups and lifestyle
  //   const filtered = data.filter(
  //     (d) =>
  //       d["Age"] &&
  //       d["Heart Disease Status"] &&
  //       d["Smoking"] &&
  //       d["Alcohol Consumption"] &&
  //       d["Exercise Habits"]
  //   );
  //   filtered.forEach((d) => {
  //     const age = +d["Age"];
  //     d["Age Group"] =
  //       age < 30
  //         ? "<30"
  //         : age < 40
  //         ? "30-39"
  //         : age < 50
  //         ? "40-49"
  //         : age < 60
  //         ? "50-59"
  //         : "60+";
  //     d[
  //       "Lifestyle"
  //     ] = `Smoke: ${d["Smoking"]}, Alcohol: ${d["Alcohol Consumption"]}, Exercise: ${d["Exercise Habits"]}`;
  //   });

  //   // Nest and compute percentage of "Yes" Heart Disease
  //   const grouped = d3
  //     .rollups(
  //       filtered,
  //       (v) => d3.mean(v, (d) => (d["Heart Disease Status"] === "Yes" ? 1 : 0)),
  //       (d) => d["Age Group"],
  //       (d) => d["Lifestyle"]
  //     )
  //     .flatMap(([ageGroup, lifestyles]) =>
  //       lifestyles.map(([lifestyle, rate]) => ({
  //         "Age Group": ageGroup,
  //         Lifestyle: lifestyle,
  //         Rate: rate,
  //       }))
  //     );

  //   const ageGroups = Array.from(new Set(grouped.map((d) => d["Age Group"])));
  //   const lifestyles = Array.from(new Set(grouped.map((d) => d["Lifestyle"])));

  //   const x0 = d3
  //     .scaleBand()
  //     .domain(ageGroups)
  //     .range([0, width])
  //     .paddingInner(0.1);

  //   const x1 = d3
  //     .scaleBand()
  //     .domain(lifestyles)
  //     .range([0, x0.bandwidth()])
  //     .padding(0.05);

  //   const y = d3
  //     .scaleLinear()
  //     .domain([0, d3.max(grouped, (d) => d.Rate)])
  //     .nice()
  //     .range([height, 0]);

  //   const color = d3
  //     .scaleOrdinal()
  //     .domain(lifestyles)
  //     .range(d3.schemeTableau10.concat(d3.schemeSet3));

  //   chart
  //     .append("g")
  //     .selectAll("g")
  //     .data(d3.groups(grouped, (d) => d["Age Group"]))
  //     .join("g")
  //     .attr("transform", (d) => `translate(${x0(d[0])},0)`)
  //     .selectAll("rect")
  //     .data((d) => d[1])
  //     .join("rect")
  //     .attr("x", (d) => x1(d["Lifestyle"]))
  //     .attr("y", (d) => y(d["Rate"]))
  //     .attr("width", x1.bandwidth())
  //     .attr("height", (d) => height - y(d["Rate"]))
  //     .attr("fill", (d) => color(d["Lifestyle"]))
  //     .on("mouseover", (event, d) => {
  //       tooltip.transition().duration(200).style("opacity", 1);
  //       tooltip
  //         .html(
  //           `<strong>Lifestyle:</strong><br>${
  //             d.Lifestyle
  //           }<br><strong>Rate:</strong> ${(d.Rate * 100).toFixed(1)}%`
  //         )
  //         .style("left", event.pageX + 10 + "px")
  //         .style("top", event.pageY - 28 + "px");
  //     })
  //     .on("mouseout", () =>
  //       tooltip.transition().duration(500).style("opacity", 0)
  //     );

  //   chart
  //     .append("g")
  //     .attr("class", "x-axis")
  //     .attr("transform", `translate(0,${height})`)
  //     .call(d3.axisBottom(x0))
  //     .selectAll("text")
  //     .attr("transform", "rotate(0)")
  //     .style("text-anchor", "middle");

  //   chart
  //     .append("g")
  //     .attr("class", "y-axis")
  //     .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));

  //   chart
  //     .append("text")
  //     .attr("x", width / 2)
  //     .attr("y", height + margin.bottom - 60)
  //     .attr("text-anchor", "middle")
  //     .text("Age Group");

  //   chart
  //     .append("text")
  //     .attr("transform", "rotate(-90)")
  //     .attr("x", -height / 2)
  //     .attr("y", -40)
  //     .attr("text-anchor", "middle")
  //     .text("Risk of Heart Disease");
  // }

  function drawLifestyleInfluence(data) {
    // Clear previous chart
    const container = d3.select("#lifestyle-influence");
    container.select("svg").remove();
  
    // Create SVG container
    const svg = container.append("svg").attr("width", 1200).attr("height", 800);
  
    const margin = { top: 40, right: 300, bottom: 220, left: 140 };
    const width = 1200 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;
  
    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // Helper: group age into defined bins
    const groupAge = (ageStr) => {
      if (!ageStr || isNaN(+ageStr)) return "Unknown";
      const age = +ageStr;
      if (age < 20) return "<20";
      if (age <= 30) return "20–30";
      if (age <= 40) return "30–40";
      if (age <= 50) return "40–50";
      if (age <= 60) return "50–60";
      if (age <= 70) return "60–70";
      return ">70";
    };
  
    // Filter and create combination columns
    const clean = data.filter(
      (d) =>
        d["Age"] &&
        d["Smoking"] &&
        d["Alcohol Consumption"] &&
        d["Exercise Habits"]
    );

    //const clean = data;
  
    clean.forEach((d) => {
      d["AgeGroup"] = groupAge(d["Age"]);
      d["Lifestyle"] = `${d["Smoking"] || "Unknown"} | ${
        d["Alcohol Consumption"] || "Unknown"
      } | ${d["Exercise Habits"] || "Unknown"}`;
    });
  
    // Aggregate: count Yes/No and calculate risk
    const matrix = d3.rollups(
      clean,
      (v) => {
        const yes = v.filter((d) => d["Heart Disease Status"] === "Yes").length;
        const total = v.length;
        return {
          yes,
          no: total - yes,
          risk: total === 0 ? 0 : yes / total,
        };
      },
      (d) => d["AgeGroup"],
      (d) => d["Lifestyle"]
    );
  
    // Flatten result to array
    const flatData = [];
    matrix.forEach(([age, lifestyles]) => {
      lifestyles.forEach(([life, stat]) => {
        flatData.push({ AgeGroup: age, Lifestyle: life, ...stat });
      });
    });
  
    const ageGroups = [
      "<20",
      "20–30",
      "30–40",
      "40–50",
      "50–60",
      "60–70",
      ">70",
      "Unknown",
    ];
    const lifestyleGroups = [...new Set(flatData.map((d) => d.Lifestyle))];
  
    // Define scales
    const x = d3.scaleBand().domain(ageGroups).range([0, width]).padding(0.05);
    const y = d3
      .scaleBand()
      .domain(lifestyleGroups)
      .range([0, height])
      .padding(0.05);
  
    const color = d3.scaleSequential(d3.interpolateReds).domain([0, 1]);
  
    // Tooltip for hover info
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #ccc")
      .style("padding", "6px 10px")
      .style("border-radius", "4px")
      .style("box-shadow", "0 0 5px rgba(0,0,0,0.2)")
      .style("visibility", "hidden");
  
    // Draw heatmap rectangles
    chart
      .selectAll("rect")
      .data(flatData)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.AgeGroup))
      .attr("y", (d) => y(d.Lifestyle))
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("fill", (d) => color(d.risk))
      .on("mouseover", function (event, d) {
        tooltip
          .style("visibility", "visible")
          .html(
            `<strong>Age Group:</strong> ${d.AgeGroup}<br>
             <strong>Lifestyle:</strong> ${d.Lifestyle}<br>
             <strong>Risk:</strong> ${(d.risk * 100).toFixed(1)}%<br>
             <strong>Yes:</strong> ${d.yes}, <strong>No:</strong> ${d.no}`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
        d3.select(this).attr("opacity", 0.8);
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("opacity", 1);
      });
  
    // Add percentage labels directly on cells
    chart
      .selectAll("text.label")
      .data(flatData)
      .enter()
      .append("text")
      .attr("x", (d) => x(d.AgeGroup) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.Lifestyle) + y.bandwidth() / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", (d) => (d.risk > 0.5 ? "#fff" : "#000"))
      .style("font-size", "11px")
      .text((d) => `${(d.risk * 100).toFixed(1)}%`);
  
    // Draw axes
    chart
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "middle");
  
    chart
      .append("g")
      .call(d3.axisLeft(y).tickSize(0))
      .selectAll("text")
      .style("text-anchor", "end");
  
    // Axis titles
    chart
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + 60)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .text("Age Group");
  
    chart
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .text("Lifestyle Combination");
  
    // Create gradient for legend matching color scale
    const legendHeight = 120;
    const defs = svg.append("defs");
    const linearGradient = defs
      .append("linearGradient")
      .attr("id", "legend-gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");
  
    // Use same color scale values to ensure match
    linearGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", color(0));
    linearGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", color(1));
  
    // Draw the gradient rectangle
    const legend = svg
      .append("g")
      .attr("transform", `translate(${margin.left + width + 30}, ${margin.top + 50})`);
  
    legend
      .append("rect")
      .attr("width", 15)
      .attr("height", legendHeight)
      .style("fill", "url(#legend-gradient)");
  
    // Draw the legend axis
    const legendScale = d3.scaleLinear().domain([0, 1]).range([legendHeight, 0]);
    legend
      .append("g")
      .attr("transform", `translate(15, 0)`)
      .call(d3.axisRight(legendScale).ticks(5).tickFormat(d3.format(".0%")));
  
    // Legend label
    legend
      .append("text")
      .attr("x", 0)
      .attr("y", -10)
      .text("Risk Level")
      .attr("font-size", "12px")
      .attr("text-anchor", "start");
  }
});
