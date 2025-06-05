FROM python:3.11-slim

# 必要なパッケージのインストール
RUN apt-get update && apt-get install -y \
    git vim curl sudo \
    && rm -rf /var/lib/apt/lists/*

# 新規ユーザーの作成
RUN useradd -ms /bin/bash devuser
RUN echo "devuser ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# エイリアスの設定
RUN touch /home/devuser/.bash_aliases
RUN echo "# Alias setting" >> /home/devuser/.bash_aliases
RUN echo "alias la='ls -a'" >> /home/devuser/.bash_aliases
RUN echo "alias ll='ls -l'" >> /home/devuser/.bash_aliases

# bashで日本語を使う設定
RUN apt-get update \
    && apt-get install -y locales
RUN locale-gen ja_JP.UTF-8
RUN echo "# Lang setting" >> /home/devuser/.bash_aliases
RUN echo "export LANG=ja_JP.UTF-8" >> /home/devuser/.bash_aliases
RUN echo 'export LANGUAGE="ja_JP:ja"' >> /home/devuser/.bash_aliases
RUN echo 'export LC_ALL="ja_JP.UTF-8"' >> /home/devuser/.bash_aliases
RUN localedef -f UTF-8 -i ja_JP ja_JP.utf8

# 作業ディレクトリ
RUN mkdir -p /home/devuser/workspace/backend
WORKDIR /home/devuser/workspace/backend

# 仮想環境の作成
RUN python3 -m venv /home/devuser/venv
RUN echo "source /home/devuser/venv/bin/activate" >> /home/devuser/.bash_aliases
RUN echo "alias pydev='uvicorn app.main:app --reload --host 0.0.0.0 --port 8000'" >> /home/devuser/.bash_aliases

# requirements を先にコピーしてキャッシュ活用
COPY backend/requirements.txt ./
RUN /home/devuser/venv/bin/pip install --upgrade pip && \
    /home/devuser/venv/bin/pip install --no-cache-dir -r requirements.txt

# アプリケーションコードをコピー
COPY backend/. .

# 所有者変更（最後にまとめて）
RUN chown -R devuser:devuser /home/devuser/

# サーバー起動
# USER devuser
# EXPOSE 8000
# CMD ["/home/devuser/venv/bin/uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]