"""
Username Generator
Simple Python version for educational use.
"""


def generate_usernames(
    rank="",
    name="",
    symbols="_-.",
    numbers="1234567890"
):

    rank = rank.strip()
    name = name.strip()

    if not rank and not name:
        return []


    name = name or "User"

    results = set()


    for symbol in symbols:

        if rank:

            results.add(
                f"{rank}{symbol}{name}"
            )

            results.add(
                f"{name}{symbol}{rank}"
            )

            results.add(
                f"{rank}{symbol}{name}{symbol}"
            )

            results.add(
                f"{name}{symbol}{rank}{symbol}"
            )

        else:

            results.add(
                f"{name}{symbol}"
            )

            results.add(
                f"{symbol}{name}"
            )


    formatted = set()


    for username in results:

        formatted.add(
            username.lower()
        )

        formatted.add(
            username.upper()
        )

        formatted.add(
            username.capitalize()
        )


    return sorted(formatted)


if __name__ == "__main__":

    rank = input(
        "Enter rank/prefix: "
    )

    name = input(
        "Enter name: "
    )

    results = generate_usernames(
        rank,
        name
    )


    print("\nGenerated Usernames:\n")

    for username in results:

        print(username)


    print(
        f"\nTotal: {len(results)}"
    )