// Character rarity system configuration
const RARITY_TIERS = {
    SSS: { weight: 10, label: 'SSS - Legendary', color: '#ff0066' },      // 0.1% chance - Hot Pink/Magenta
    SS: { weight: 50, label: 'SS - Mythic', color: '#9933ff' },           // 0.5% chance - Purple
    S: { weight: 200, label: 'S - Epic', color: '#ff6600' },              // 2% chance - Bright Orange
    A: { weight: 800, label: 'A - Rare', color: '#ffcc00' },              // 8% chance - Gold
    B: { weight: 2000, label: 'B - Uncommon', color: '#00ccff' },         // 20% chance - Cyan
    C: { weight: 3000, label: 'C - Common', color: '#00cc66' },           // 30% chance - Darker Green (was too bright)
    D: { weight: 2500, label: 'D - Basic', color: '#8b7355' },            // 25% chance - Brown (distinct from gray)
    F: { weight: 1440, label: 'F - Starter', color: '#b8b8b8' }           // 14.4% chance - Medium Gray (distinct from brown)
};

const CHARACTER_IMAGES = {
    "Monkey D. Luffy": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ec719f46-44d6-4593-ab1e-952b01909a4e/d57vqib-703ad600-c6f2-4f99-9d89-5d3817208219.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2VjNzE5ZjQ2LTQ0ZDYtNDU5My1hYjFlLTk1MmIwMTkwOWE0ZVwvZDU3dnFpYi03MDNhZDYwMC1jNmYyLTRmOTktOWQ4OS01ZDM4MTcyMDgyMTkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.MDljTCjgh5wUDesVbS212iPfh4guv1KJUyF-8lyO8Gk",
    "Roronoa Zoro": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ec719f46-44d6-4593-ab1e-952b01909a4e/d5litwf-0862eea8-8f00-4613-9e3e-e4f98a879f9b.png/v1/fit/w_828,h_1264,q_70,strp/epp___romance_dawn__zoro_by_sergiart_d5litwf-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI2NCIsInBhdGgiOiIvZi9lYzcxOWY0Ni00NGQ2LTQ1OTMtYWIxZS05NTJiMDE5MDlhNGUvZDVsaXR3Zi0wODYyZWVhOC04ZjAwLTQ2MTMtOWUzZS1lNGY5OGE4NzlmOWIucG5nIiwid2lkdGgiOiI8PTgyOCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.0Ejn-2vbmopEfsXF2RUxDGTjiYJpcaId8mQYQ4hieCU",
    "Koby": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ce98647-5975-4f7f-bd09-0ed719433ee1/d7pze6h-6d72ad14-8fbe-48d9-a74b-6a8d8cdf7f3f.jpg/v1/fill/w_1280,h_1876,q_75,strp/one_piece___coby_by_onepieceworldproject_d7pze6h-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTg3NiIsInBhdGgiOiJcL2ZcLzVjZTk4NjQ3LTU5NzUtNGY3Zi1iZDA5LTBlZDcxOTQzM2VlMVwvZDdwemU2aC02ZDcyYWQxNC04ZmJlLTQ4ZDktYTc0Yi02YThkOGNkZjdmM2YuanBnIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.DAA1Q7cBjinXggxrQ6Yc_x5YPD6Su3M3U4YJX6RJlS4",
    "Alvida": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ce98647-5975-4f7f-bd09-0ed719433ee1/ddrl9ds-4fac1530-8bf1-49e3-b6f3-8c1d6c1881d7.jpg/v1/fit/w_828,h_1214,q_70,strp/one_piece_alvida_by_onepieceworldproject_ddrl9ds-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjI1MiIsInBhdGgiOiIvZi81Y2U5ODY0Ny01OTc1LTRmN2YtYmQwOS0wZWQ3MTk0MzNlZTEvZGRybDlkcy00ZmFjMTUzMC04YmYxLTQ5ZTMtYjZmMy04YzFkNmMxODgxZDcuanBnIiwid2lkdGgiOiI8PTE1MzcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.Ajwx0vKDDiJ_1gyVdq6wbmAJEhqmQdBmytVFQzdL5fo",
    "Shanks": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ce98647-5975-4f7f-bd09-0ed719433ee1/d6tmtua-40267365-7467-41d8-9535-fa4c836fa387.jpg/v1/fit/w_828,h_1214,q_70,strp/one_piece___shanks_by_onepieceworldproject_d6tmtua-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjI1MiIsInBhdGgiOiIvZi81Y2U5ODY0Ny01OTc1LTRmN2YtYmQwOS0wZWQ3MTk0MzNlZTEvZDZ0bXR1YS00MDI2NzM2NS03NDY3LTQxZDgtOTUzNS1mYTRjODM2ZmEzODcuanBnIiwid2lkdGgiOiI8PTE1MzcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.2Ee6gF8FtTR9MXyQ6Hr6EU36GbJCEeiP6H9Pe6-90-E",
    "Nami": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ce98647-5975-4f7f-bd09-0ed719433ee1/dl2vi5r-fcb63cef-c063-4121-a9dc-555d7cf3d1f4.jpg/v1/fit/w_828,h_1214,q_70,strp/one_piece___nami_by_onepieceworldproject_dl2vi5r-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjI1MiIsInBhdGgiOiIvZi81Y2U5ODY0Ny01OTc1LTRmN2YtYmQwOS0wZWQ3MTk0MzNlZTEvZGwydmk1ci1mY2I2M2NlZi1jMDYzLTQxMjEtYTlkYy01NTVkN2NmM2QxZjQuanBnIiwid2lkdGgiOiI8PTE1MzcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.6oL7aF1PVnfvMyi7JvYGA2sL6GgipXkMVccn1jMfEJE",
    "Buggy": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ce98647-5975-4f7f-bd09-0ed719433ee1/devnmsc-f6b96f9c-809b-4088-b3fe-f7ca5b0854d1.jpg/v1/fit/w_828,h_1214,q_70,strp/one_piece___buggy_the_clown_by_onepieceworldproject_devnmsc-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjI1MiIsInBhdGgiOiIvZi81Y2U5ODY0Ny01OTc1LTRmN2YtYmQwOS0wZWQ3MTk0MzNlZTEvZGV2bm1zYy1mNmI5NmY5Yy04MDliLTQwODgtYjNmZS1mN2NhNWIwODU0ZDEuanBnIiwid2lkdGgiOiI8PTE1MzcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.txVYKx4HWGjVw0b5cUTD1DRTeLWK--oxIA-7-Edrgkc",
    "Mohji": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ce98647-5975-4f7f-bd09-0ed719433ee1/djycezu-c357c46e-a900-4239-b595-6767a6a38b06.jpg/v1/fit/w_828,h_1214,q_70,strp/one_piece___mohji_by_onepieceworldproject_djycezu-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjI1MiIsInBhdGgiOiIvZi81Y2U5ODY0Ny01OTc1LTRmN2YtYmQwOS0wZWQ3MTk0MzNlZTEvZGp5Y2V6dS1jMzU3YzQ2ZS1hOTAwLTQyMzktYjU5NS02NzY3YTZhMzhiMDYuanBnIiwid2lkdGgiOiI8PTE1MzcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.CG0SeVpUdgm6ktLJ8SbVU6X0ORmyxNPCMdo-AOp5n2c",
    "Cabaji": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ce98647-5975-4f7f-bd09-0ed719433ee1/dk2ya15-d7d4ddcb-d07b-4a59-a2ca-d011cbd2247e.jpg/v1/fit/w_828,h_1214,q_70,strp/one_piece___cabaji_by_onepieceworldproject_dk2ya15-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTg3NiIsInBhdGgiOiIvZi81Y2U5ODY0Ny01OTc1LTRmN2YtYmQwOS0wZWQ3MTk0MzNlZTEvZGsyeWExNS1kN2Q0ZGRjYi1kMDdiLTRhNTktYTJjYS1kMDExY2JkMjI0N2UuanBnIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.NhFtDJtPxtRQMMOGz11xDGd76hhe8ksxBQcECYYUYeU",
    "Usopp": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ce98647-5975-4f7f-bd09-0ed719433ee1/d7ba41o-8b1cd969-f144-46ab-8470-449f7728bf30.jpg/v1/fit/w_828,h_1214,q_70,strp/one_piece___usopp_by_onepieceworldproject_d7ba41o-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjI1MiIsInBhdGgiOiIvZi81Y2U5ODY0Ny01OTc1LTRmN2YtYmQwOS0wZWQ3MTk0MzNlZTEvZDdiYTQxby04YjFjZDk2OS1mMTQ0LTQ2YWItODQ3MC00NDlmNzcyOGJmMzAuanBnIiwid2lkdGgiOiI8PTE1MzcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.8KMzgPlFeSVMNkgVpDBFoOe5BZQlkq_tPYEL6mhLqCQ",
    "Kuro": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ce98647-5975-4f7f-bd09-0ed719433ee1/d709e68-e5c1ab51-e93e-426d-9896-7c8590928169.jpg/v1/fit/w_828,h_1214,q_70,strp/one_piece___kuro_by_onepieceworldproject_d709e68-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjI1MiIsInBhdGgiOiIvZi81Y2U5ODY0Ny01OTc1LTRmN2YtYmQwOS0wZWQ3MTk0MzNlZTEvZDcwOWU2OC1lNWMxYWI1MS1lOTNlLTQyNmQtOTg5Ni03Yzg1OTA5MjgxNjkuanBnIiwid2lkdGgiOiI8PTE1MzcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.1Khec5s644mEFibiTCSDN4xBcDmHEBYjh3Wgq4YOF5I",
    "Kaya": "https://tse4.mm.bing.net/th/id/OIP.PRQjvzXURPPBaEzGRh-OwAAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
    "Jango": "https://tse4.mm.bing.net/th/id/OIP.3l1yLoMGrBT--2SsfbhYcQHaKH?rs=1&pid=ImgDetMain&o=7&rm=3",
    "Sham": "https://i.pinimg.com/736x/9c/e1/16/9ce1166e8efaa77034e0ea486ef865ac.jpg",
    "Buchi": "https://i.pinimg.com/736x/67/48/87/67488711dc61c0052058df430413a7c7.jpg",
    "Sanji": "https://i.pinimg.com/236x/a6/78/37/a67837a646f4e631ebf3cd485ba93d7e.jpg?nii=t",
    "Zeff": "https://i.pinimg.com/736x/66/24/87/662487b5ef285a4ff58fcd5a3aac0812.jpg",
    "Don Krieg": "https://i.pinimg.com/736x/2e/1d/9e/2e1d9e064779ef3b33a2345054398052.jpg",
    "Gin": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ce98647-5975-4f7f-bd09-0ed719433ee1/ddgik88-9227ffac-2891-4526-8add-3b87de9ca0e5.jpg/v1/fit/w_828,h_1214,q_70,strp/one_piece___gin_by_onepieceworldproject_ddgik88-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjI1MiIsInBhdGgiOiIvZi81Y2U5ODY0Ny01OTc1LTRmN2YtYmQwOS0wZWQ3MTk0MzNlZTEvZGRnaWs4OC05MjI3ZmZhYy0yODkxLTQ1MjYtOGFkZC0zYjg3ZGU5Y2EwZTUuanBnIiwid2lkdGgiOiI8PTE1MzcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.okFrdqB9CNwCbgbL0D62GK7X0scDSLk7ab5c2mDA3TY",
    "Pearl": "https://tse1.mm.bing.net/th/id/OIP.wRNGNsv-Gfeu8bXfEGrvlQHaL9?rs=1&pid=ImgDetMain&o=7&rm=3",
    "Dracule Mihawk": "https://tse2.mm.bing.net/th/id/OIP.7RPNltZzYzZWpH3z7Q5bNwHaGa?rs=1&pid=ImgDetMain&o=7&rm=3",
    "Patty": "https://th.bing.com/th/id/R.0de9cfda79850c49770ac2bc595e1326?rik=7Fdb14%2bTUMe8kA&pid=ImgRaw&r=0",
    "Arlong": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ce98647-5975-4f7f-bd09-0ed719433ee1/dl3mqnw-60657e84-3598-4056-aa4f-13f64dd285a6.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiIvZi81Y2U5ODY0Ny01OTc1LTRmN2YtYmQwOS0wZWQ3MTk0MzNlZTEvZGwzbXFudy02MDY1N2U4NC0zNTk4LTQwNTYtYWE0Zi0xM2Y2NGRkMjg1YTYuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.af6-EuHW5fAQ--3Zhxw4v460IeG4BMtIEs1nYMVV7CY",
    "Nami (Arlong Park)": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ec719f46-44d6-4593-ab1e-952b01909a4e/d5m54iz-3f4b35a7-087c-458c-8ce0-a0e27cd12825.png/v1/fit/w_828,h_1264,q_70,strp/epp___arlong_park__nami_by_sergiart_d5m54iz-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI2NCIsInBhdGgiOiIvZi9lYzcxOWY0Ni00NGQ2LTQ1OTMtYWIxZS05NTJiMDE5MDlhNGUvZDVtNTRpei0zZjRiMzVhNy0wODdjLTQ1OGMtOGNlMC1hMGUyN2NkMTI4MjUucG5nIiwid2lkdGgiOiI8PTgyOCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.WQwsznJCAtSQmvw0s-WxdDFpU0ttAULJvYoCNQjGpq4",
    "Kuroobi": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ce98647-5975-4f7f-bd09-0ed719433ee1/d7vpjiu-b52e9e6b-435a-40f6-adf3-4c5e0025ec7a.jpg/v1/fit/w_828,h_1214,q_70,strp/one_piece___kuroobi_by_onepieceworldproject_d7vpjiu-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjI1MiIsInBhdGgiOiIvZi81Y2U5ODY0Ny01OTc1LTRmN2YtYmQwOS0wZWQ3MTk0MzNlZTEvZDd2cGppdS1iNTJlOWU2Yi00MzVhLTQwZjYtYWRmMy00YzVlMDAyNWVjN2EuanBnIiwid2lkdGgiOiI8PTE1MzcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.v6YWy3P2yRE7SOlTk_zTkka8bDGHvOI30_CjQoaR8bM",
    "Chew": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ce98647-5975-4f7f-bd09-0ed719433ee1/dexthmu-537e923f-e38b-49d4-9c0e-a2c02943f755.jpg/v1/fit/w_828,h_1214,q_70,strp/one_piece___chew_by_onepieceworldproject_dexthmu-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjI1MiIsInBhdGgiOiIvZi81Y2U5ODY0Ny01OTc1LTRmN2YtYmQwOS0wZWQ3MTk0MzNlZTEvZGV4dGhtdS01MzdlOTIzZi1lMzhiLTQ5ZDQtOWMwZS1hMmMwMjk0M2Y3NTUuanBnIiwid2lkdGgiOiI8PTE1MzcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.JWp0No8O41P8Xv2-Hs_aKztJGHxvOnchXnJT0lEiytM",
    "Hatchan": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ce98647-5975-4f7f-bd09-0ed719433ee1/d81rnti-61c3485c-411e-4b28-b84b-929a990bf61f.jpg/v1/fit/w_828,h_1214,q_70,strp/one_piece___hatchan_by_onepieceworldproject_d81rnti-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjI1MiIsInBhdGgiOiIvZi81Y2U5ODY0Ny01OTc1LTRmN2YtYmQwOS0wZWQ3MTk0MzNlZTEvZDgxcm50aS02MWMzNDg1Yy00MTFlLTRiMjgtYjg0Yi05MjlhOTkwYmY2MWYuanBnIiwid2lkdGgiOiI8PTE1MzcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.UQZWji3P4dFD5gL9YAfVqHF4bERCCFbz49ij8rGdBuA",
    "Nojiko": "https://tse3.mm.bing.net/th/id/OIP.pYD2e0eeLso2GilWkttyhwAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
    "Smoker": "https://th.bing.com/th/id/OIP.9Fz7_lWlUEy3WfuRTw24vgAAAA?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
    "Tashigi": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ce98647-5975-4f7f-bd09-0ed719433ee1/dcghae5-58dd2191-277c-4385-a6a9-299867708003.jpg/v1/fit/w_828,h_1214,q_70,strp/one_piece___tashigi_by_onepieceworldproject_dcghae5-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTg3NiIsInBhdGgiOiIvZi81Y2U5ODY0Ny01OTc1LTRmN2YtYmQwOS0wZWQ3MTk0MzNlZTEvZGNnaGFlNS01OGRkMjE5MS0yNzdjLTQzODUtYTZhOS0yOTk4Njc3MDgwMDMuanBnIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.fhe8-6F_yp-nOMEmM6450j6h207WejlYlxImgvePDp4",
    "Dragon": "https://tse1.mm.bing.net/th/id/OIP.M3Jb8aCZ3bN1dY3TEfAVLgHaKy?rs=1&pid=ImgDetMain&o=7&rm=3",
    "Bartolomeo (Young)": "https://tse3.mm.bing.net/th/id/OIP.fo2mmqaruPmsxCTGh5ZC9gHaKl?rs=1&pid=ImgDetMain&o=7&rm=3",
    "Mr. 9": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ce98647-5975-4f7f-bd09-0ed719433ee1/dh1u5uz-045f066a-87d2-447c-9bbd-ecd0e7052cec.jpg/v1/fill/w_738,h_1082,q_70,strp/one_piece_mr_9_by_onepieceworldproject_dh1u5uz-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjI1MiIsInBhdGgiOiJcL2ZcLzVjZTk4NjQ3LTU5NzUtNGY3Zi1iZDA5LTBlZDcxOTQzM2VlMVwvZGgxdTV1ei0wNDVmMDY2YS04N2QyLTQ0N2MtOWJiZC1lY2QwZTcwNTJjZWMuanBnIiwid2lkdGgiOiI8PTE1MzcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.xpbLlhvpTqdiXxWABsl-IYYLpIPbJ6Yc7DhNv0TTeMo",
    "Miss Monday": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/51158316-fd7e-48ca-b5fe-8542e9dfe357/dfcr0bx-8ef3e495-e250-431d-89be-51e9fe573d0d.png/v1/fill/w_841,h_950/miss_monday_by_bodskih_dfcr0bx-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTU1OCIsInBhdGgiOiJcL2ZcLzUxMTU4MzE2LWZkN2UtNDhjYS1iNWZlLTg1NDJlOWRmZTM1N1wvZGZjcjBieC04ZWYzZTQ5NS1lMjUwLTQzMWQtODliZS01MWU5ZmU1NzNkMGQucG5nIiwid2lkdGgiOiI8PTEzODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.wr1ylx9D41Z4Hl3mltsRt5rOAC9hUHYLMpF5IHD8tpo",
    "Igaram": "https://i.pinimg.com/736x/a5/9c/45/a59c45141682a03317db5f5b86e0f4d6.jpg",
    "Princess Vivi": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1ce1372a-b75c-4058-b0c8-1bf1c2d6837e/de30ax5-1890382d-ec9a-4ccd-a333-2f126b9b82e3.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjI1MiIsInBhdGgiOiIvZi8xY2UxMzcyYS1iNzVjLTQwNTgtYjBjOC0xYmYxYzJkNjgzN2UvZGUzMGF4NS0xODkwMzgyZC1lYzlhLTRjY2QtYTMzMy0yZjEyNmI5YjgyZTMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.kM-1vMHaj06MJCImnlJsR38mHumRp5b_carmg2rOmdw",
    "Dorry": "https://i.pinimg.com/736x/c5/f8/6c/c5f86c48669e647557a63153d7280c9f.jpg",
    "Brogy": "https://i.pinimg.com/736x/39/71/b0/3971b0ec988e1072f880c37f977c9a0e.jpg",
    "Mr. 3": "https://tse3.mm.bing.net/th/id/OIP.Z35c8hlbu-8RiIdwDUWxsAAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
    "Miss Goldenweek": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ce98647-5975-4f7f-bd09-0ed719433ee1/d8du5tf-ba04f220-aafa-4839-b086-5960a38d2343.jpg/v1/fit/w_828,h_1214,q_70,strp/one_piece___miss_goldenweek_by_onepieceworldproject_d8du5tf-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjI1MiIsInBhdGgiOiIvZi81Y2U5ODY0Ny01OTc1LTRmN2YtYmQwOS0wZWQ3MTk0MzNlZTEvZDhkdTV0Zi1iYTA0ZjIyMC1hYWZhLTQ4MzktYjA4Ni01OTYwYTM4ZDIzNDMuanBnIiwid2lkdGgiOiI8PTE1MzcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.wIvBFZrfNwcLCEBS6_-LXnLJyJq6HHPaDeAohvU07wU",
    "Mr. 5": "https://i.pinimg.com/originals/cf/0f/93/cf0f93575cee582d01ba465041592858.jpg",
    "Tony Tony Chopper": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ec719f46-44d6-4593-ab1e-952b01909a4e/d5j838u-522da15c-443e-47a4-b5d5-e0a926e7a99f.png/v1/fit/w_828,h_1264,q_70,strp/epp___drum__chopper_by_sergiart_d5j838u-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI2NCIsInBhdGgiOiIvZi9lYzcxOWY0Ni00NGQ2LTQ1OTMtYWIxZS05NTJiMDE5MDlhNGUvZDVqODM4dS01MjJkYTE1Yy00NDNlLTQ3YTQtYjVkNS1lMGE5MjZlN2E5OWYucG5nIiwid2lkdGgiOiI8PTgyOCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.Z-tcI2TNSJBah8Rzk8p6zS_OwcF7XEcvAu3TR91PRCE",
    "Wapol": "https://tse4.mm.bing.net/th/id/OIP.CeVZcZjwgkHp2QowMx9YPwHaK2?rs=1&pid=ImgDetMain&o=7&rm=3",
    "Dr. Kureha": "https://tse4.mm.bing.net/th/id/OIP.6oT8H4iufjlwxThjep64jQHaKU?rs=1&pid=ImgDetMain&o=7&rm=3",
    "Dalton": "https://i.pinimg.com/736x/05/27/7e/05277eef7a73bdf555bc3b1cf01bb2bb.jpg",
    "Chess": "https://tse4.mm.bing.net/th/id/OIP.BPMUGvtKZoUEom23UH6BIAHaPC?rs=1&pid=ImgDetMain&o=7&rm=3",
    "Kuromarimo": "https://i.pinimg.com/originals/ed/f6/7e/edf67e3336b49a1f23714a861e973688.jpg",
    "Crocodile": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ce98647-5975-4f7f-bd09-0ed719433ee1/d6qedj9-285dac66-9b6e-418e-be50-9df6d7b01717.jpg/v1/fit/w_828,h_1214,q_70,strp/one_piece___crocodile_by_onepieceworldproject_d6qedj9-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjI1MiIsInBhdGgiOiIvZi81Y2U5ODY0Ny01OTc1LTRmN2YtYmQwOS0wZWQ3MTk0MzNlZTEvZDZxZWRqOS0yODVkYWM2Ni05YjZlLTQxOGUtYmU1MC05ZGY2ZDdiMDE3MTcuanBnIiwid2lkdGgiOiI8PTE1MzcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.f4AaX4WiZhHd3SAehptFl5gMYXXdVa_CnfAHrZMDEI8",
    "Nico Robin": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ce98647-5975-4f7f-bd09-0ed719433ee1/d6u682k-954262f0-6794-41f7-a999-ecc6fa1ec553.jpg/v1/fit/w_828,h_1214,q_70,strp/one_piece___nico_robin_by_onepieceworldproject_d6u682k-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjI1MiIsInBhdGgiOiIvZi81Y2U5ODY0Ny01OTc1LTRmN2YtYmQwOS0wZWQ3MTk0MzNlZTEvZDZ1Njgyay05NTQyNjJmMC02Nzk0LTQxZjctYTk5OS1lY2M2ZmExZWM1NTMuanBnIiwid2lkdGgiOiI8PTE1MzcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.-10BlbsYn-jsLlRN_UlYrKht2bdWQKK0fwE_KzP5lAw",
    "Mr. 1 (Daz Bones)": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1ce1372a-b75c-4058-b0c8-1bf1c2d6837e/de2zwd9-dc59ab3e-13e9-4118-aea5-397164116e70.png/v1/fit/w_533,h_800/daz_bonez___mr1_by_hobbj_de2zwd9-375w-2x.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODAwIiwicGF0aCI6Ii9mLzFjZTEzNzJhLWI3NWMtNDA1OC1iMGM4LTFiZjFjMmQ2ODM3ZS9kZTJ6d2Q5LWRjNTlhYjNlLTEzZTktNDExOC1hZWE1LTM5NzE2NDExNmU3MC5wbmciLCJ3aWR0aCI6Ijw9NTMzIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.6g7IJhEH0IjoQDX3e4_MBBPaBWrnAbHWnytKw1MKBH4",
    "Mr. 2 (Bon Clay)": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ce98647-5975-4f7f-bd09-0ed719433ee1/d70r0t0-d14f8217-4d93-4ff4-9200-8e92bed4c6af.jpg/v1/fit/w_828,h_1214,q_70,strp/one_piece___bentham_by_onepieceworldproject_d70r0t0-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjI1MiIsInBhdGgiOiIvZi81Y2U5ODY0Ny01OTc1LTRmN2YtYmQwOS0wZWQ3MTk0MzNlZTEvZDcwcjB0MC1kMTRmODIxNy00ZDkzLTRmZjQtOTIwMC04ZTkyYmVkNGM2YWYuanBnIiwid2lkdGgiOiI8PTE1MzcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.iL-GeWcyaDAt07o3X2yD9Hv9NbpmMqkOB3KxABm9dUk",
    "Miss Doublefinger": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/51158316-fd7e-48ca-b5fe-8542e9dfe357/dfcr137-c5214b14-e402-42e8-ba9f-4ed1582d5e3c.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjI1MiIsInBhdGgiOiJcL2ZcLzUxMTU4MzE2LWZkN2UtNDhjYS1iNWZlLTg1NDJlOWRmZTM1N1wvZGZjcjEzNy1jNTIxNGIxNC1lNDAyLTQyZTgtYmE5Zi00ZWQxNTgyZDVlM2MucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.GKTGW_f7lqvQ6zpbcCM5Sf3HW3ouam4xmC1C-ZLiM6I",
    "Bellamy": "",
    "Sarquiss": "",
    "Masira": "",
    "Shoujou": "",
    "Montblanc Cricket": "",
    "Enel": "",
    "Gan Fall": "",
    "Wyper": "",
    "Gedatsu": "",
    "Shura": "",
    "Ohm": "",
    "Satori": "",
    "Braham": "",
    "Kamakiri": "",
    "Laki": "",
    "Conis": "",
    "Aisa": "",
    "Pagaya": "",
    "Yama": "",
    "Foxy": "",
    "Porche": "",
    "Hamburg": "",
    "Franky": "",
    "Iceburg": "",
    "Paulie": "",
    "Rob Lucci": "",
    "Kaku": "",
    "Kalifa": "",
    "Blueno": "",
    "Tilestone": "",
    "Peepley Lulu": "",
    "Zambai": "",
    "Mozu": "",
    "Kiwi": "",
    "Kokoro": "",
    "Spandam": "",
    "Jabra": "",
    "Kumadori": "",
    "Fukurou": "",
    "Nero": "",
    "Wanze": "",
    "T-Bone": "",
    "Jerry": "",
    "Kashii": "",
    "Oimo": "",
    "Chimney": "",
    "Gonbe": "",
    "Monkey D. Luffy (Gear 2)": "",
    "Roronoa Zoro (Asura)": "",
    "Sanji (Diable Jambe)": "",
    "Nico Robin (Enies Lobby)": "",
    "Sogeking": "",
        "Gecko Moria": "",
    "Bartholomew Kuma": "",
    "Perona": "",
    "Absalom": "",
    "Ryuma": "",
    "Oz": "",
    "Brook": "",
    "Hogback": "",
    "Cindry": "",
    "Lola": "",
    "Risky Brothers": "",
    "Nightmare Luffy": "",
    "Victoria Cindry": "",
    "Hildon": "",
    "Kumacy": "",
    "Silvers Rayleigh": "",
    "Kizaru": "",
    "Sentomaru": "",
    "Trafalgar Law": "",
    "Eustass Kid": "",
    "Jewelry Bonney": "",
    "Basil Hawkins": "",
    "X Drake": "",
    "Killer": "",
    "Capone Bege": "",
    "Duval": "",
    "Boa Hancock": "",
    "Boa Sandersonia": "",
    "Boa Marigold": "",
    "Marguerite": "",
    "Sweet Pea": "",
    "Aphelandra": "",
    "Magellan": "",
    "Hannyabal": "",
    "Shiryu": "",
    "Emporio Ivankov": "",
    "Inazuma": "",
    "Saldeath": "",
    "Sadi": "",
    "Minozebra": "",
    "Minotaurus": "",
    "Domino": "",
    "Buggy (Impel Down)": "",
    "Whitebeard": "",
    "Akainu": "",
    "Aokiji": "",
    "Marco": "",
    "Jozu": "",
    "Vista": "",
    "Doflamingo": "",
    "Portgas D. Ace": "",
    "Sengoku": ""
};

// Card data for 10 One Piece arcs - 52 characters total
// Enhanced Card Database with rarity and availability
const CARD_DATABASE = [
    // Romance Dawn Arc (5 cards)
    { id: 1, name: "Monkey D. Luffy", arc: "Romance Dawn", power: 65, rarity: "A", weight: 800, available: true },
    { id: 2, name: "Roronoa Zoro", arc: "Romance Dawn", power: 62, rarity: "A", weight: 800, available: true },
    { id: 3, name: "Koby", arc: "Romance Dawn", power: 15, rarity: "C", weight: 3000, available: true },
    { id: 4, name: "Alvida", arc: "Romance Dawn", power: 25, rarity: "D", weight: 2500, available: true },
    { id: 5, name: "Shanks", arc: "Romance Dawn", power: 98, rarity: "SSS", weight: 10, available: true },

    // Orange Town Arc (4 cards)
    { id: 6, name: "Nami", arc: "Orange Town", power: 35, rarity: "B", weight: 2000, available: true },
    { id: 7, name: "Buggy", arc: "Orange Town", power: 45, rarity: "B", weight: 2000, available: true },
    { id: 8, name: "Mohji", arc: "Orange Town", power: 18, rarity: "D", weight: 2500, available: true },
    { id: 9, name: "Cabaji", arc: "Orange Town", power: 22, rarity: "D", weight: 2500, available: true },

    // Syrup Village Arc (6 cards)
    { id: 10, name: "Usopp", arc: "Syrup Village", power: 28, rarity: "B", weight: 2000, available: true },
    { id: 11, name: "Kuro", arc: "Syrup Village", power: 48, rarity: "B", weight: 2000, available: true },
    { id: 12, name: "Kaya", arc: "Syrup Village", power: 5, rarity: "F", weight: 1440, available: true },
    { id: 13, name: "Jango", arc: "Syrup Village", power: 30, rarity: "C", weight: 3000, available: true },
    { id: 14, name: "Sham", arc: "Syrup Village", power: 20, rarity: "D", weight: 2500, available: true },
    { id: 15, name: "Buchi", arc: "Syrup Village", power: 20, rarity: "D", weight: 2500, available: true },

    // Baratie Arc (7 cards)
    { id: 16, name: "Sanji", arc: "Baratie", power: 60, rarity: "A", weight: 800, available: true },
    { id: 17, name: "Zeff", arc: "Baratie", power: 55, rarity: "A", weight: 800, available: true },
    { id: 18, name: "Don Krieg", arc: "Baratie", power: 52, rarity: "B", weight: 2000, available: true },
    { id: 19, name: "Gin", arc: "Baratie", power: 42, rarity: "B", weight: 2000, available: true },
    { id: 20, name: "Pearl", arc: "Baratie", power: 35, rarity: "C", weight: 3000, available: true },
    { id: 21, name: "Dracule Mihawk", arc: "Baratie", power: 100, rarity: "SSS", weight: 10, available: true },
    { id: 22, name: "Patty", arc: "Baratie", power: 25, rarity: "D", weight: 2500, available: true },

    // Arlong Park Arc (6 cards)
    { id: 23, name: "Arlong", arc: "Arlong Park", power: 68, rarity: "S", weight: 200, available: true },
    { id: 24, name: "Nami (Arlong Park)", arc: "Arlong Park", power: 38, rarity: "B", weight: 2000, available: true },
    { id: 25, name: "Kuroobi", arc: "Arlong Park", power: 40, rarity: "B", weight: 2000, available: true },
    { id: 26, name: "Chew", arc: "Arlong Park", power: 38, rarity: "C", weight: 3000, available: true },
    { id: 27, name: "Hatchan", arc: "Arlong Park", power: 36, rarity: "C", weight: 3000, available: true },
    { id: 28, name: "Nojiko", arc: "Arlong Park", power: 12, rarity: "F", weight: 1440, available: true },

    // Loguetown Arc (4 cards)
    { id: 29, name: "Smoker", arc: "Loguetown", power: 72, rarity: "S", weight: 200, available: true },
    { id: 30, name: "Tashigi", arc: "Loguetown", power: 40, rarity: "B", weight: 2000, available: true },
    { id: 31, name: "Dragon", arc: "Loguetown", power: 95, rarity: "SSS", weight: 10, available: true },
    { id: 32, name: "Bartolomeo (Young)", arc: "Loguetown", power: 20, rarity: "D", weight: 2500, available: true },

    // Whiskey Peak Arc (4 cards)
    { id: 33, name: "Mr. 9", arc: "Whiskey Peak", power: 30, rarity: "C", weight: 3000, available: true },
    { id: 34, name: "Miss Monday", arc: "Whiskey Peak", power: 32, rarity: "C", weight: 3000, available: true },
    { id: 35, name: "Igaram", arc: "Whiskey Peak", power: 35, rarity: "C", weight: 3000, available: true },
    { id: 36, name: "Princess Vivi", arc: "Whiskey Peak", power: 28, rarity: "B", weight: 2000, available: true },

    // Little Garden Arc (5 cards)
    { id: 37, name: "Dorry", arc: "Little Garden", power: 70, rarity: "S", weight: 200, available: true },
    { id: 38, name: "Brogy", arc: "Little Garden", power: 70, rarity: "S", weight: 200, available: true },
    { id: 39, name: "Mr. 3", arc: "Little Garden", power: 44, rarity: "B", weight: 2000, available: true },
    { id: 40, name: "Miss Goldenweek", arc: "Little Garden", power: 26, rarity: "C", weight: 3000, available: true },
    { id: 41, name: "Mr. 5", arc: "Little Garden", power: 42, rarity: "B", weight: 2000, available: true },

    // Drum Island Arc (6 cards)
    { id: 42, name: "Tony Tony Chopper", arc: "Drum Island", power: 50, rarity: "A", weight: 800, available: true },
    { id: 43, name: "Wapol", arc: "Drum Island", power: 46, rarity: "B", weight: 2000, available: true },
    { id: 44, name: "Dr. Kureha", arc: "Drum Island", power: 40, rarity: "B", weight: 2000, available: true },
    { id: 45, name: "Dalton", arc: "Drum Island", power: 48, rarity: "B", weight: 2000, available: true },
    { id: 46, name: "Chess", arc: "Drum Island", power: 32, rarity: "C", weight: 3000, available: true },
    { id: 47, name: "Kuromarimo", arc: "Drum Island", power: 30, rarity: "C", weight: 3000, available: true },

    // Alabasta Arc (5 cards)
    { id: 48, name: "Crocodile", arc: "Alabasta", power: 85, rarity: "SS", weight: 50, available: true },
    { id: 49, name: "Nico Robin", arc: "Alabasta", power: 58, rarity: "A", weight: 800, available: true },
    { id: 50, name: "Mr. 1 (Daz Bones)", arc: "Alabasta", power: 65, rarity: "A", weight: 800, available: true },
    { id: 51, name: "Mr. 2 (Bon Clay)", arc: "Alabasta", power: 56, rarity: "A", weight: 800, available: true },
    { id: 52, name: "Miss Doublefinger", arc: "Alabasta", power: 50, rarity: "B", weight: 2000, available: true },

    // Jaya Arc (5 cards)
    { id: 53, name: "Bellamy", arc: "Jaya", power: 54, rarity: "B", weight: 2000, available: false },
    { id: 54, name: "Sarquiss", arc: "Jaya", power: 38, rarity: "C", weight: 3000, available: false },
    { id: 55, name: "Masira", arc: "Jaya", power: 34, rarity: "C", weight: 3000, available: false },
    { id: 56, name: "Shoujou", arc: "Jaya", power: 34, rarity: "C", weight: 3000, available: false },
    { id: 57, name: "Montblanc Cricket", arc: "Jaya", power: 42, rarity: "B", weight: 2000, available: false },

    // Skypiea Arc (14 cards)
    { id: 58, name: "Enel", arc: "Skypiea", power: 90, rarity: "SS", weight: 50, available: false },
    { id: 59, name: "Gan Fall", arc: "Skypiea", power: 62, rarity: "A", weight: 800, available: false },
    { id: 60, name: "Wyper", arc: "Skypiea", power: 66, rarity: "A", weight: 800, available: false },
    { id: 61, name: "Gedatsu", arc: "Skypiea", power: 52, rarity: "B", weight: 2000, available: false },
    { id: 62, name: "Shura", arc: "Skypiea", power: 50, rarity: "B", weight: 2000, available: false },
    { id: 63, name: "Ohm", arc: "Skypiea", power: 54, rarity: "B", weight: 2000, available: false },
    { id: 64, name: "Satori", arc: "Skypiea", power: 46, rarity: "B", weight: 2000, available: false },
    { id: 65, name: "Braham", arc: "Skypiea", power: 40, rarity: "C", weight: 3000, available: false },
    { id: 66, name: "Kamakiri", arc: "Skypiea", power: 38, rarity: "C", weight: 3000, available: false },
    { id: 67, name: "Laki", arc: "Skypiea", power: 36, rarity: "C", weight: 3000, available: false },
    { id: 68, name: "Conis", arc: "Skypiea", power: 10, rarity: "F", weight: 1440, available: false },
    { id: 69, name: "Aisa", arc: "Skypiea", power: 8, rarity: "F", weight: 1440, available: false },
    { id: 70, name: "Pagaya", arc: "Skypiea", power: 18, rarity: "D", weight: 2500, available: false },
    { id: 71, name: "Yama", arc: "Skypiea", power: 44, rarity: "B", weight: 2000, available: false },

    // Long Ring Long Land Arc (3 cards)
    { id: 72, name: "Foxy", arc: "Long Ring Long Land", power: 48, rarity: "B", weight: 2000, available: false },
    { id: 73, name: "Porche", arc: "Long Ring Long Land", power: 28, rarity: "C", weight: 3000, available: false },
    { id: 74, name: "Hamburg", arc: "Long Ring Long Land", power: 32, rarity: "C", weight: 3000, available: false },

    // Water 7 Arc (13 cards)
    { id: 75, name: "Franky", arc: "Water 7", power: 70, rarity: "S", weight: 200, available: false },
    { id: 76, name: "Iceburg", arc: "Water 7", power: 52, rarity: "B", weight: 2000, available: false },
    { id: 77, name: "Paulie", arc: "Water 7", power: 46, rarity: "B", weight: 2000, available: false },
    { id: 78, name: "Rob Lucci", arc: "Water 7", power: 88, rarity: "SS", weight: 50, available: false },
    { id: 79, name: "Kaku", arc: "Water 7", power: 76, rarity: "S", weight: 200, available: false },
    { id: 80, name: "Kalifa", arc: "Water 7", power: 64, rarity: "A", weight: 800, available: false },
    { id: 81, name: "Blueno", arc: "Water 7", power: 68, rarity: "S", weight: 200, available: false },
    { id: 82, name: "Tilestone", arc: "Water 7", power: 38, rarity: "C", weight: 3000, available: false },
    { id: 83, name: "Peepley Lulu", arc: "Water 7", power: 36, rarity: "C", weight: 3000, available: false },
    { id: 84, name: "Zambai", arc: "Water 7", power: 34, rarity: "C", weight: 3000, available: false },
    { id: 85, name: "Mozu", arc: "Water 7", power: 24, rarity: "D", weight: 2500, available: false },
    { id: 86, name: "Kiwi", arc: "Water 7", power: 24, rarity: "D", weight: 2500, available: false },
    { id: 87, name: "Kokoro", arc: "Water 7", power: 14, rarity: "F", weight: 1440, available: false },

    // Enies Lobby Arc (17 cards)
    { id: 88, name: "Spandam", arc: "Enies Lobby", power: 22, rarity: "D", weight: 2500, available: false },
    { id: 89, name: "Jabra", arc: "Enies Lobby", power: 72, rarity: "S", weight: 200, available: false },
    { id: 90, name: "Kumadori", arc: "Enies Lobby", power: 70, rarity: "S", weight: 200, available: false },
    { id: 91, name: "Fukurou", arc: "Enies Lobby", power: 68, rarity: "S", weight: 200, available: false },
    { id: 92, name: "Nero", arc: "Enies Lobby", power: 42, rarity: "B", weight: 2000, available: false },
    { id: 93, name: "Wanze", arc: "Enies Lobby", power: 40, rarity: "B", weight: 2000, available: false },
    { id: 94, name: "T-Bone", arc: "Enies Lobby", power: 50, rarity: "B", weight: 2000, available: false },
    { id: 95, name: "Jerry", arc: "Enies Lobby", power: 32, rarity: "C", weight: 3000, available: false },
    { id: 96, name: "Kashii", arc: "Enies Lobby", power: 48, rarity: "B", weight: 2000, available: false },
    { id: 97, name: "Oimo", arc: "Enies Lobby", power: 48, rarity: "B", weight: 2000, available: false },
    { id: 98, name: "Chimney", arc: "Enies Lobby", power: 6, rarity: "F", weight: 1440, available: false },
    { id: 99, name: "Gonbe", arc: "Enies Lobby", power: 4, rarity: "F", weight: 1440, available: false },
    { id: 100, name: "Monkey D. Luffy (Gear 2)", arc: "Enies Lobby", power: 82, rarity: "SS", weight: 50, available: false },
    { id: 101, name: "Roronoa Zoro (Asura)", arc: "Enies Lobby", power: 80, rarity: "S", weight: 200, available: false },
    { id: 102, name: "Sanji (Diable Jambe)", arc: "Enies Lobby", power: 78, rarity: "S", weight: 200, available: false },
    { id: 103, name: "Nico Robin (Enies Lobby)", arc: "Enies Lobby", power: 66, rarity: "A", weight: 800, available: false },
    { id: 104, name: "Sogeking", arc: "Enies Lobby", power: 44, rarity: "B", weight: 2000, available: false },

    // Thriller Bark Arc (15 cards)
    { id: 105, name: "Gecko Moria", arc: "Thriller Bark", power: 82, rarity: "SS", weight: 50, available: false },
    { id: 106, name: "Bartholomew Kuma", arc: "Thriller Bark", power: 92, rarity: "SSS", weight: 10, available: false },
    { id: 107, name: "Perona", arc: "Thriller Bark", power: 56, rarity: "A", weight: 800, available: false },
    { id: 108, name: "Absalom", arc: "Thriller Bark", power: 58, rarity: "A", weight: 800, available: false },
    { id: 109, name: "Ryuma", arc: "Thriller Bark", power: 74, rarity: "S", weight: 200, available: false },
    { id: 110, name: "Oz", arc: "Thriller Bark", power: 80, rarity: "S", weight: 200, available: false },
    { id: 111, name: "Brook", arc: "Thriller Bark", power: 64, rarity: "A", weight: 800, available: false },
    { id: 112, name: "Hogback", arc: "Thriller Bark", power: 36, rarity: "C", weight: 3000, available: false },
    { id: 113, name: "Cindry", arc: "Thriller Bark", power: 40, rarity: "C", weight: 3000, available: false },
    { id: 114, name: "Lola", arc: "Thriller Bark", power: 42, rarity: "B", weight: 2000, available: false },
    { id: 115, name: "Risky Brothers", arc: "Thriller Bark", power: 30, rarity: "C", weight: 3000, available: false },
    { id: 116, name: "Nightmare Luffy", arc: "Thriller Bark", power: 86, rarity: "SS", weight: 50, available: false },
    { id: 117, name: "Victoria Cindry", arc: "Thriller Bark", power: 26, rarity: "D", weight: 2500, available: false },
    { id: 118, name: "Hildon", arc: "Thriller Bark", power: 28, rarity: "D", weight: 2500, available: false },
    { id: 119, name: "Kumacy", arc: "Thriller Bark", power: 22, rarity: "D", weight: 2500, available: false },

    // Sabaody Archipelago Arc (11 cards)
    { id: 120, name: "Silvers Rayleigh", arc: "Sabaody Archipelago", power: 96, rarity: "SSS", weight: 10, available: false },
    { id: 121, name: "Kizaru", arc: "Sabaody Archipelago", power: 94, rarity: "SSS", weight: 10, available: false },
    { id: 122, name: "Sentomaru", arc: "Sabaody Archipelago", power: 70, rarity: "S", weight: 200, available: false },
    { id: 123, name: "Trafalgar Law", arc: "Sabaody Archipelago", power: 76, rarity: "S", weight: 200, available: false },
    { id: 124, name: "Eustass Kid", arc: "Sabaody Archipelago", power: 74, rarity: "S", weight: 200, available: false },
    { id: 125, name: "Jewelry Bonney", arc: "Sabaody Archipelago", power: 62, rarity: "A", weight: 800, available: false },
    { id: 126, name: "Basil Hawkins", arc: "Sabaody Archipelago", power: 66, rarity: "A", weight: 800, available: false },
    { id: 127, name: "X Drake", arc: "Sabaody Archipelago", power: 68, rarity: "S", weight: 200, available: false },
    { id: 128, name: "Killer", arc: "Sabaody Archipelago", power: 60, rarity: "A", weight: 800, available: false },
    { id: 129, name: "Capone Bege", arc: "Sabaody Archipelago", power: 58, rarity: "A", weight: 800, available: false },
    { id: 130, name: "Duval", arc: "Sabaody Archipelago", power: 44, rarity: "B", weight: 2000, available: false },

    // Amazon Lily Arc (6 cards)
    { id: 131, name: "Boa Hancock", arc: "Amazon Lily", power: 84, rarity: "SS", weight: 50, available: false },
    { id: 132, name: "Boa Sandersonia", arc: "Amazon Lily", power: 60, rarity: "A", weight: 800, available: false },
    { id: 133, name: "Boa Marigold", arc: "Amazon Lily", power: 60, rarity: "A", weight: 800, available: false },
    { id: 134, name: "Marguerite", arc: "Amazon Lily", power: 38, rarity: "C", weight: 3000, available: false },
    { id: 135, name: "Sweet Pea", arc: "Amazon Lily", power: 34, rarity: "C", weight: 3000, available: false },
    { id: 136, name: "Aphelandra", arc: "Amazon Lily", power: 36, rarity: "C", weight: 3000, available: false },

    // Impel Down Arc (11 cards)
    { id: 137, name: "Magellan", arc: "Impel Down", power: 88, rarity: "SS", weight: 50, available: false },
    { id: 138, name: "Hannyabal", arc: "Impel Down", power: 54, rarity: "B", weight: 2000, available: false },
    { id: 139, name: "Shiryu", arc: "Impel Down", power: 78, rarity: "S", weight: 200, available: false },
    { id: 140, name: "Emporio Ivankov", arc: "Impel Down", power: 72, rarity: "S", weight: 200, available: false },
    { id: 141, name: "Inazuma", arc: "Impel Down", power: 56, rarity: "A", weight: 800, available: false },
    { id: 142, name: "Saldeath", arc: "Impel Down", power: 40, rarity: "B", weight: 2000, available: false },
    { id: 143, name: "Sadi", arc: "Impel Down", power: 48, rarity: "B", weight: 2000, available: false },
    { id: 144, name: "Minozebra", arc: "Impel Down", power: 52, rarity: "B", weight: 2000, available: false },
    { id: 145, name: "Minotaurus", arc: "Impel Down", power: 50, rarity: "B", weight: 2000, available: false },
    { id: 146, name: "Domino", arc: "Impel Down", power: 42, rarity: "B", weight: 2000, available: false },
    { id: 147, name: "Buggy (Impel Down)", arc: "Impel Down", power: 46, rarity: "B", weight: 2000, available: false },

    // Marineford Arc (9 cards)
    { id: 148, name: "Whitebeard", arc: "Marineford", power: 100, rarity: "SSS", weight: 10, available: false },
    { id: 149, name: "Akainu", arc: "Marineford", power: 98, rarity: "SSS", weight: 10, available: false },
    { id: 150, name: "Aokiji", arc: "Marineford", power: 94, rarity: "SSS", weight: 10, available: false },
    { id: 151, name: "Marco", arc: "Marineford", power: 86, rarity: "SS", weight: 50, available: false },
    { id: 152, name: "Jozu", arc: "Marineford", power: 80, rarity: "S", weight: 200, available: false },
    { id: 153, name: "Vista", arc: "Marineford", power: 76, rarity: "S", weight: 200, available: false },
    { id: 154, name: "Doflamingo", arc: "Marineford", power: 82, rarity: "SS", weight: 50, available: false },
    { id: 155, name: "Portgas D. Ace", arc: "Marineford", power: 84, rarity: "SS", weight: 50, available: false },
    { id: 156, name: "Sengoku", arc: "Marineford", power: 92, rarity: "SS", weight: 50, available: false }

];

// Get all unique arcs
const ARCS = [...new Set(CARD_DATABASE.map(card => card.arc))];

// Helper functions for the rarity system
const CardRaritySystem = {
    // Get available card pool based on arc availability and card availability
    getAvailablePool() {
        return CARD_DATABASE.filter(card => 
            card.available && ARC_AVAILABILITY[card.arc]
        );
    },

    // Weighted random selection based on rarity weights
    drawRandomCard(excludeIds = []) {
        const pool = this.getAvailablePool().filter(card => !excludeIds.includes(card.id));
        if (pool.length === 0) return null;

        // Calculate total weight
        const totalWeight = pool.reduce((sum, card) => sum + card.weight, 0);
        
        // Random weighted selection
        let random = Math.random() * totalWeight;
        
        for (const card of pool) {
            random -= card.weight;
            if (random <= 0) {
                return card;
            }
        }
        
        // Fallback to last card (shouldn't reach here)
        return pool[pool.length - 1];
    },

    // Draw multiple unique cards
    drawMultipleCards(count, excludeIds = []) {
        const drawn = [];
        const excluded = new Set(excludeIds);
        
        for (let i = 0; i < count; i++) {
            const card = this.drawRandomCard([...excluded]);
            if (!card) break;
            drawn.push(card);
            excluded.add(card.id);
        }
        
        return drawn;
    },

    // Generate starter deck (5 cards) - weighted random from available pool
    generateStarterDeck() {
        const startingCards = (typeof DEV_CONFIG !== 'undefined' && DEV_CONFIG.GAME.STARTING_CARDS) || 5;
        return this.drawMultipleCards(startingCards);
    },

    // Get cards by rarity tier
    getCardsByRarity(rarity) {
        return this.getAvailablePool().filter(card => card.rarity === rarity);
    },

    // Get rarity info
    getRarityInfo(rarity) {
        return RARITY_TIERS[rarity] || RARITY_TIERS['F'];
    },

    // Calculate drop chance percentage
    getDropChance(rarity) {
        const totalWeight = Object.values(RARITY_TIERS).reduce((sum, tier) => sum + tier.weight, 0);
        return ((RARITY_TIERS[rarity]?.weight || 0) / totalWeight * 100).toFixed(2);
    }
};

// Bot difficulty configuration - each difficulty uses cards from specific rarity tiers
const BOT_DIFFICULTIES = {
    EASY: {
        name: 'Easy',
        description: 'Uses only F, D, and C tier cards',
        rarities: ['F', 'D', 'C'],
        icon: '😊'
    },
    NORMAL: {
        name: 'Normal',
        description: 'Uses C, D, and B tier cards',
        rarities: ['D', 'C', 'B'],
        icon: '🙂'
    },
    HARD: {
        name: 'Hard',
        description: 'Uses B, A, and S tier cards',
        rarities: ['B', 'A', 'S'],
        icon: '😠'
    },
    EXPERT: {
        name: 'Expert',
        description: 'Uses A, S, and SS tier cards',
        rarities: ['A', 'S', 'SS'],
        icon: '😈'
    },
    LEGENDARY: {
        name: 'Legendary',
        description: 'Uses S, SS, and SSS tier cards',
        rarities: ['S', 'SS', 'SSS'],
        icon: '💀'
    }
};

// Bot helper functions
const BotManager = {
    // Create a bot opponent
    createBot(difficulty) {
        return {
            id: 'bot_' + Date.now(),
            username: `${BOT_DIFFICULTIES[difficulty].icon} ${BOT_DIFFICULTIES[difficulty].name} Bot`,
            isBot: true,
            difficulty: difficulty,
            wins: 0,
            losses: 0,
            collection: new Set(CARD_DATABASE.map(c => c.id)) // Bot has all cards
        };
    },

    // Generate bot deck based on difficulty
    generateBotDeck(difficulty, count = 5) {
        const allowedRarities = BOT_DIFFICULTIES[difficulty].rarities;
        const pool = CardRaritySystem.getAvailablePool().filter(card => 
            allowedRarities.includes(card.rarity)
        );
        
        if (pool.length === 0) {
            console.warn('No cards available for bot difficulty:', difficulty);
            return [];
        }

        // Shuffle and pick cards
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    },

    // Bot plays a card (instant decision)
    playBotCard(botDeck) {
        if (botDeck.length === 0) return null;
        return botDeck.shift();
    }
};
