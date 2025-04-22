from .static.listscraper import get_hot_stocks
from .static.detailscraper import get_stock_detail, get_stock_comments
from .static.summarize import analyze_stock_comments
from .models import StockDetail
from .serializers import StockSerializer
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

import re
import traceback

# Create your views here.

@api_view(['GET'])
def hot(request):
    stocks = get_hot_stocks()
    if stocks:
        return Response(stocks, status=status.HTTP_200_OK)
    else:
        return Response({'error' : '주식 데이터 조회 실패'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_favorites(request):
    stocks = request.user.favorite_stocks.all()
    serializer = StockSerializer(stocks, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def detail(request, name):
    try:
        stock_detail = get_stock_detail(name)
        change_text = stock_detail['등락률']
        match = re.search(r'\(([-+0-9.]+)%\)', change_text)
        if match:
            change = float(match.group(1))
        else:
            change = 0.0
        StockDetail.objects.update_or_create(
            name=name,
            defaults={
                'code': stock_detail['코드'],
                'price': int(stock_detail['가격'].replace(',', '').replace('원','')),
                'change': change,
                'chart': stock_detail['차트']
            }
        )

    except:
        print(traceback.format_exc())
        return Response({'error': '주식 데이터 조회 실패'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    try:
        stock_comments = get_stock_comments(name)
    except:
        stock_comments = None

    try:
        analysis = analyze_stock_comments(stock_comments)
    except:
        print(traceback.format_exc())
        analysis  = {"summary" : "AI 데이터 가져오기 실패", "temperature" : 0}

    response_data = {
        "stock": stock_detail,
        "comments": stock_comments,
        "ai_analysis": analysis
    }
    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def toggle_favorite(request, name):
    stock = get_object_or_404(StockDetail, name=name)
    user = request.user

    if request.method == 'GET':
        if user in stock.favorites.all():
            return Response({'favorites' : True}, status=status.HTTP_200_OK)
        else:
            return Response({'favorites' : False}, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        if user in stock.favorites.all():
            stock.favorites.remove(user)
            return Response({"message": "즐겨찾기 취소"}, status=200)
        else:
            stock.favorites.add(user)
            return Response({"message": "즐겨찾기 추가"}, status=201)