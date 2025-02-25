document.addEventListener("DOMContentLoaded", function () {
  d3.csv("project_heart_disease.csv").then(function (data) {
    console.log("Data loaded", data);

    drawAgeDistribution(data);
    drawSmokingImpact(data);
    drawExerciseImpact(data);
    drawLifestyleInfluence(data);
  });

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

  function drawAgeDistribution(data) {
    const width = 700,
      height = 400;
    const margin = { top: 50, right: 50, bottom: 80, left: 60 };

    const svg = d3
      .select("#age-distribution")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const ageGroups = d3.rollup(
      data,
      (v) => v.length,
      (d) => Math.floor(+d.Age / 10) * 10
    );
    const counts = Array.from(ageGroups, ([age, count]) => ({
      age,
      count,
    })).sort((a, b) => a.age - b.age);

    const x = d3
      .scaleBand()
      .domain(counts.map((d) => d.age))
      .range([0, width])
      .padding(0.1);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(counts, (d) => d.count) * 1.1])
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll("rect")
      .data(counts)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.age))
      .attr("y", (d) => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.count))
      .attr("fill", "steelblue");

    svg
      .selectAll("text.label")
      .data(counts)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.age) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.count) - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-size", "12px")
      .text((d) => d.count);

    drawAxisLabels(svg, width, height, "Age Groups", "Number of People");
  }

  function drawSmokingImpact(data) {
    const width = 700,
      height = 400;
    const margin = { top: 50, right: 50, bottom: 80, left: 60 };

    const svg = d3
      .select("#smoking-impact")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const smokingGroups = d3.rollup(
      data,
      (v) => v.length,
      (d) => d.Smoking || "Undefined"
    );
    const counts = Array.from(smokingGroups, ([smoking, count]) => ({
      smoking,
      count,
    }));

    const x = d3
      .scaleBand()
      .domain(counts.map((d) => d.smoking))
      .range([0, width])
      .padding(0.1);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(counts, (d) => d.count) * 1.1])
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll("rect")
      .data(counts)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.smoking))
      .attr("y", (d) => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.count))
      .attr("fill", "orange");

    svg
      .selectAll("text.label")
      .data(counts)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.smoking) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.count) - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-size", "12px")
      .text((d) => d.count);

    drawAxisLabels(svg, width, height, "Smoking Status", "Number of People");
  }

  function drawExerciseImpact(data) {
    const width = 700,
      height = 400;
    const margin = { top: 50, right: 50, bottom: 80, left: 60 };

    const svg = d3
      .select("#exercise-impact")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const exerciseGroups = d3.rollup(
      data,
      (v) => v.length,
      (d) => (d["Exercise Habits"] || "Undefined").trim()
    );
    const counts = Array.from(exerciseGroups, ([exercise, count]) => ({
      exercise,
      count,
    }));

    const x = d3
      .scaleBand()
      .domain(counts.map((d) => d.exercise))
      .range([0, width])
      .padding(0.1);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(counts, (d) => d.count) * 1.1])
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));
    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll("rect")
      .data(counts)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.exercise))
      .attr("y", (d) => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.count))
      .attr("fill", "green");

    svg
      .selectAll("text.label")
      .data(counts)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.exercise) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.count) - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-size", "12px")
      .text((d) => d.count);

    drawAxisLabels(svg, width, height, "Exercise Habits", "Number of People");
  }

  function drawLifestyleInfluence(data) {
    const width = 900;
    const height = 500;
    const margin = { top: 50, right: 50, bottom: 120, left: 80 };

    const svg = d3
      .select("#lifestyle-influence")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const lifestyleGroups = d3.rollup(
      data,
      (v) => v.length,
      (d) => {
        const smoking =
          d.Smoking === "Yes" || d.Smoking === "No" ? d.Smoking : "Undefined";
        const alcohol = ["None", "Low", "Medium", "High"].includes(
          d.AlcoholConsumption
        )
          ? d.AlcoholConsumption
          : "Undefined";
        const exercise = ["Low", "Medium", "High"].includes(
          (d["Exercise Habits"] || "").trim()
        )
          ? d["Exercise Habits"]
          : "Undefined";
        return `${smoking}-${alcohol}-${exercise}`;
      }
    );

    const counts = Array.from(lifestyleGroups, ([lifestyle, count]) => ({
      lifestyle,
      count,
    }));

    const x = d3
      .scaleBand()
      .domain(counts.map((d) => d.lifestyle))
      .range([0, width - margin.left - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(counts, (d) => d.count) * 1.1])
      .range([height - margin.top - margin.bottom, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-30)")
      .style("text-anchor", "end");

    svg.append("g").call(d3.axisLeft(y));

    svg
      .append("text")
      .attr("x", (width - margin.left - margin.right) / 2)
      .attr("y", -30)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Smoking - Alcohol - Exercise Habits Classification");

    svg
      .selectAll("rect")
      .data(counts)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.lifestyle))
      .attr("y", (d) => y(d.count))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - margin.top - margin.bottom - y(d.count))
      .attr("fill", "purple");

    svg
      .selectAll("text.label")
      .data(counts)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.lifestyle) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.count) - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-size", "12px")
      .text((d) => d.count);

    drawAxisLabels(svg, 700, 400, "Lifestyle Combination", "Number of People");
  }
});
