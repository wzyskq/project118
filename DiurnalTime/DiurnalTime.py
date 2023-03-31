from math import acos, tan, radians, degrees
from re import split
import datetime


def half_day_hour(ta, le):
    ta = radians(ta)
    le = radians(le)
    return degrees(acos(-tan(ta) * tan(le))) / 15  # 半昼长


def dot_to_colon(time):
    hour = int(time)
    rest = time - hour
    minute = round(rest * 60)
    if minute < 10:
        minute = f'0{minute}'
    return f'{hour}:{minute}'  # 时分值


def degrees_to_dot(degree):
    pattern = r'\s+'
    split_list = split(pattern, degree)
    try:
        split_int = int(split_list[0])
    except:
        split_int = 0
    try:
        split_float = int(split_list[1]) / 60
    except:
        split_float = 0

    if split_int < 0:
        result = split_int - split_float
    else:
        result = split_int + split_float
    return result  # 小数值


def which_day(year, month, date_):
    end = datetime.date(year, month, date_)
    start = datetime.date(year, 1, 1)
    result = (end - start).days + 1
    return result


def date_to_day(date_):
    pattern = r'\s+'
    split_list = split(pattern, date_)
    if int(split_list[0]) < 13:  # input 2 number
        split_year = 2023
        try:
            split_month = int(split_list[0])
        except:
            split_month = 1
        try:
            split_day = int(split_list[1])
        except:
            split_day = 1

    else:  # input 3 number
        try:
            split_year = int(split_list[0])
        except:
            split_year = 2023
        try:
            split_month = int(split_list[1])
        except:
            split_month = 1
        try:
            split_day = int(split_list[2])
        except:
            split_day = 1
    result = which_day(split_year, split_month, split_day)
    return result


while True:
    model = input('Model[a/d (angle/date)]:')
    print('时区:东八区')
    if model == 'd' or model == 'date':
        date = date_to_day(input('Date:'))  # get date
        solstice = degrees_to_dot('23 26')  # 23°26‘ => 23.433…

        sEquinox = date_to_day('2023 3 21')
        sSolstice = date_to_day('2023 6 22')
        aEquinox = date_to_day('2023 9 23')
        wSolstice = date_to_day('2023 12 22')
        if date > (wSolstice + 8):
            print('日期不在范围内！')
            continue

        if date < sEquinox:  # 1.1 - 3.21
            theta = 0 - (sEquinox - date) / (9 + sEquinox) * solstice
        elif date < sSolstice:  # 3.21 - 6.22
            theta = (date - sEquinox) / (sSolstice - sEquinox) * solstice
        elif date < aEquinox:  # 6.22 - 9.23
            theta = (aEquinox - date) / (aEquinox - sSolstice) * solstice
        elif date < wSolstice:  # 9.23 - 12.22
            theta = 0 - (date - aEquinox) / (wSolstice - aEquinox) * solstice
        else:  # 12.22 - 12.30
            theta = - solstice + (date - wSolstice) / (9 + sEquinox) * solstice

        # print(f'theta: {theta}')

    else:
        theta = degrees_to_dot(input('Right Ascension:'))
        if theta < -23.45 or theta > 23.45:
            print('赤经范围错误')
            continue

    latitude = degrees_to_dot(input('Latitude:'))  # get latitude => float
    try:
        half_hour = half_day_hour(theta, latitude)
    except:
        print('该地为极昼或极夜区!')
        continue

    day = dot_to_colon(half_hour * 2)
    night = dot_to_colon(24 - half_hour * 2)
    sunrise = dot_to_colon(12 - half_hour)
    sunset = dot_to_colon(12 + half_hour)

    print(f'昼长 {day}\t夜长 {night}\n日出 {sunrise}\t日落 {sunset}')
