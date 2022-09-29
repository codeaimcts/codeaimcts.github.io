var question_data = {
    "A+B": {
        "Description": "A + B is often used as an example of the easiest problem possible to show some contest platform. However, some scientists have observed that sometimes this problem is not so easy to get accepted. Want to try?",
        "Constraints": [],
        "Input": "The input contains two integers a and b (0 ≤ a, b ≤ 10^3), separated by a single space.",
        "Output": "Output the sum of the given integers.",
        "Examples": [
            {
                "Input": "5 14",
                "Output": "19",
                "Output_Text": ""
            },
            {
                "Input": "381 492",
                "Output": "873",
                "Output_Text": ""
            }
        ]
    },
    "Circle": {
        "Description": "Given is an integer r. How many times is the area of a circle of radius r larger than the area of a circle of radius 1? It can be proved that the answer is always an integer under the constraints given.",
        "Constraints": [
            "1 \leq r \leq 100",
            "All values in input are integers."
        ],
        "Input": "Input is given from Standard Input in the following format: r",
        "Output": "Print the area of a circle of radius r, divided by the area of a circle of radius 1, as an integer.",
        "Examples": [
            {
                "Input": "2",
                "Output": "4",
                "Output_Text": "The area of a circle of radius 2 is 4 times larger than the area of a circle of radius 1. Note that output must be an integer - for example, 4.0 will not be accepted."
            }
        ]
    },
    "Dont_be_late": {
        "Description": "Takahashi is meeting up with Aoki. They have planned to meet at a place that is D meters away from Takahashi's house in T minutes from now. Takahashi will leave his house now and go straight to the place at a speed of S meters per minute. Will he arrive in time?",
        "Constraints": [
            "1 \leq D \leq 10000",
            "1 \leq T \leq 10000",
            "1 \leq S \leq 10000",
            "All values in input are integers."
        ],
        "Input": "Input is given from Standard Input in the following format: D T S",
        "Output": "If Takahashi will reach the place in time, print Yes; otherwise, print No.",
        "Examples": [
            {
                "Input": "1000 15 80",
                "Output": "Yes",
                "Output_Text": "It takes 12.5 minutes to go 1000 meters to the place at a speed of 80 meters per minute. They have planned to meet in 15 minutes so he will arrive in time."
            }
        ]
    }
}